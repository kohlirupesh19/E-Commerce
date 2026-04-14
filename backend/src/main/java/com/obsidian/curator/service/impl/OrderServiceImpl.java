package com.obsidian.curator.service.impl;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.obsidian.curator.dto.request.OrderCreateRequest;
import com.obsidian.curator.dto.request.OrderVerifyPaymentRequest;
import com.obsidian.curator.entity.*;
import com.obsidian.curator.entity.enums.DiscountType;
import com.obsidian.curator.entity.enums.OrderStatus;
import com.obsidian.curator.entity.enums.PaymentMethodType;
import com.obsidian.curator.entity.enums.PaymentStatus;
import com.obsidian.curator.exception.InvalidRequestException;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.repository.*;
import com.obsidian.curator.service.OrderService;
import com.obsidian.curator.util.PriceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final PriceUtil priceUtil;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    @Override
    @Transactional
    public Map<String, Object> createOrder(String email, OrderCreateRequest request) {
        User user = getUser(email);
        Address address = addressRepository.findByIdAndUser(request.addressId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new InvalidRequestException("Cart is empty"));
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            throw new InvalidRequestException("Cart is empty");
        }

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (!Boolean.TRUE.equals(product.getIsAvailable())) {
                throw new InvalidRequestException("Product unavailable: " + product.getName());
            }
            if (product.getStock() != null && item.getQuantity() > product.getStock()) {
                throw new InvalidRequestException("Insufficient stock for " + product.getName());
            }
        }

        BigDecimal subtotal = cartItems.stream()
                .map(this::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tax = priceUtil.tax(subtotal);
        BigDecimal shipping = subtotal.compareTo(BigDecimal.ZERO) > 0 ? new BigDecimal("15.00") : BigDecimal.ZERO;

        Coupon coupon = resolveCoupon(request.couponCode(), subtotal);
        BigDecimal discount = coupon == null ? BigDecimal.ZERO : calculateDiscount(coupon, subtotal);
        BigDecimal total = subtotal.add(tax).add(shipping).subtract(discount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

        PaymentMethodType paymentMethod;
        try {
            paymentMethod = PaymentMethodType.valueOf(request.paymentMethod().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new InvalidRequestException("Unsupported payment method");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order.setPaymentMethod(paymentMethod);
        order.setCoupon(coupon);
        order.setDiscountAmount(discount);
        order.setTotalAmount(total);
        order.setRazorpayOrderId("order_" + UUID.randomUUID().toString().replace("-", ""));
        order = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setVariant(cartItem.getVariant());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(unitPrice(cartItem));
            orderItems.add(orderItemRepository.save(orderItem));

            Product product = cartItem.getProduct();
            if (product.getStock() != null) {
                product.setStock(Math.max(0, product.getStock() - cartItem.getQuantity()));
            }
            if (product.getStock() != null && product.getStock() == 0) {
                product.setIsAvailable(false);
            }
        }

        if (coupon != null) {
            coupon.setUsedCount((coupon.getUsedCount() == null ? 0 : coupon.getUsedCount()) + 1);
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(total);
        payment.setStatus(PaymentStatus.PENDING);
        paymentRepository.save(payment);

        return mapOrder(order, orderItems, payment, subtotal, tax, shipping);
    }

    @Override
    @Transactional
    public Map<String, Object> verifyPayment(String email, OrderVerifyPaymentRequest request) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUser(request.orderId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!Objects.equals(order.getRazorpayOrderId(), request.razorpayOrderId())) {
            throw new InvalidRequestException("Razorpay order id mismatch");
        }

        boolean valid = verifySignature(request.razorpayOrderId(), request.razorpayPaymentId(), request.razorpaySignature());
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found"));

        if (!valid) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setRazorpayPaymentId(request.razorpayPaymentId());
            payment.setRazorpaySignature(request.razorpaySignature());
            throw new InvalidRequestException("Invalid Razorpay signature");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setRazorpayPaymentId(request.razorpayPaymentId());
        payment.setRazorpaySignature(request.razorpaySignature());

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);

        cartRepository.findByUser(user).ifPresent(cartItemRepository::deleteByCart);

        return mapOrder(order, orderItemRepository.findByOrderId(order.getId()), payment, null, null, null);
    }

    @Override
    public Map<String, Object> getOrder(String email, UUID orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        return mapOrder(order, orderItemRepository.findByOrderId(order.getId()), payment, null, null, null);
    }

    @Override
    public List<Map<String, Object>> getMyOrders(String email, OrderStatus status) {
        User user = getUser(email);
        List<Order> orders;
        if (status != null) {
            orders = orderRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status);
        } else {
            orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        }
        return orders.stream().map(order -> {
            Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
            return mapOrder(order, orderItemRepository.findByOrderId(order.getId()), payment, null, null, null);
        }).toList();
    }

    @Override
    @Transactional
    public Map<String, Object> cancelOrder(String email, UUID orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!(order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.CONFIRMED)) {
            throw new InvalidRequestException("Order cannot be cancelled at this stage");
        }

        order.setStatus(OrderStatus.CANCELLED);
        restoreStock(order);

        return mapOrder(order, orderItemRepository.findByOrderId(order.getId()), paymentRepository.findByOrderId(order.getId()).orElse(null), null, null, null);
    }

    @Override
    @Transactional
    public Map<String, Object> requestReturn(String email, UUID orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new InvalidRequestException("Only delivered orders can be returned");
        }

        order.setStatus(OrderStatus.RETURN_REQUESTED);
        return mapOrder(order, orderItemRepository.findByOrderId(order.getId()), paymentRepository.findByOrderId(order.getId()).orElse(null), null, null, null);
    }

    @Override
    @Transactional
    public Map<String, Object> reorder(String email, UUID orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart freshCart = new Cart();
            freshCart.setUser(user);
            return cartRepository.save(freshCart);
        });

        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            if (!Boolean.TRUE.equals(product.getIsAvailable())) {
                continue;
            }

            CartItem cartItem = cartItemRepository.findByCartAndProductAndVariant(cart, product, orderItem.getVariant())
                    .orElseGet(() -> {
                        CartItem ci = new CartItem();
                        ci.setCart(cart);
                        ci.setProduct(product);
                        ci.setVariant(orderItem.getVariant());
                        ci.setQuantity(0);
                        return ci;
                    });

            int nextQty = cartItem.getQuantity() + orderItem.getQuantity();
            if (product.getStock() != null && nextQty > product.getStock()) {
                nextQty = product.getStock();
            }
            if (nextQty > 0) {
                cartItem.setQuantity(nextQty);
                cartItemRepository.save(cartItem);
            }
        }

        return Map.of(
                "message", "Order items moved to cart",
                "orderId", order.getId()
        );
    }

    @Override
    public byte[] generateInvoice(String email, UUID orderId) {
        User user = getUser(email);
        Order order = orderRepository.findByIdAndUser(orderId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("The Obsidian Curator Invoice"));
        document.add(new Paragraph("Order ID: " + order.getId()));
        document.add(new Paragraph("Date: " + order.getCreatedAt()));
        document.add(new Paragraph("Payment Status: " + order.getPaymentStatus()));
        document.add(new Paragraph("Status: " + order.getStatus()));
        document.add(new Paragraph(" "));

        for (OrderItem item : items) {
            document.add(new Paragraph(item.getProduct().getName() + " x " + item.getQuantity() + " = $" +
                    item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity())).setScale(2, RoundingMode.HALF_UP)));
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Total: $" + order.getTotalAmount().setScale(2, RoundingMode.HALF_UP)));

        document.close();
        return out.toByteArray();
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Coupon resolveCoupon(String couponCode, BigDecimal subtotal) {
        if (couponCode == null || couponCode.isBlank()) {
            return null;
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode)
                .orElseThrow(() -> new InvalidRequestException("Coupon not found"));

        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            throw new InvalidRequestException("Coupon is inactive");
        }
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidRequestException("Coupon has expired");
        }
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new InvalidRequestException("Coupon usage limit reached");
        }
        if (coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new InvalidRequestException("Order does not meet coupon minimum amount");
        }
        return coupon;
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;
        if (coupon.getDiscountType() == DiscountType.FLAT) {
            discount = coupon.getDiscountValue();
        } else {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        }

        if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
            discount = coupon.getMaxDiscount();
        }

        return discount.min(subtotal).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal unitPrice(CartItem item) {
        return item.getProduct().getDiscountPrice() != null ? item.getProduct().getDiscountPrice() : item.getProduct().getPrice();
    }

    private BigDecimal lineTotal(CartItem item) {
        return unitPrice(item).multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    private void restoreStock(Order order) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            int existing = product.getStock() == null ? 0 : product.getStock();
            product.setStock(existing + orderItem.getQuantity());
            if (!Boolean.TRUE.equals(product.getIsAvailable()) && product.getStock() > 0) {
                product.setIsAvailable(true);
            }
        }
    }

    private Map<String, Object> mapOrder(
            Order order,
            List<OrderItem> items,
            Payment payment,
            BigDecimal subtotalHint,
            BigDecimal taxHint,
            BigDecimal shippingHint
    ) {
        BigDecimal subtotal = subtotalHint != null ? subtotalHint : items.stream()
                .map(i -> i.getPriceAtPurchase().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tax = taxHint != null ? taxHint : priceUtil.tax(subtotal);
        BigDecimal shipping = shippingHint != null ? shippingHint : (subtotal.compareTo(BigDecimal.ZERO) > 0 ? new BigDecimal("15.00") : BigDecimal.ZERO);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", order.getId());
        out.put("status", order.getStatus());
        out.put("paymentStatus", order.getPaymentStatus());
        out.put("paymentMethod", order.getPaymentMethod());
        out.put("createdAt", order.getCreatedAt());
        out.put("razorpayOrderId", order.getRazorpayOrderId());
        out.put("trackingNumber", order.getTrackingNumber());
        out.put("totals", Map.of(
            "subtotal", subtotal.setScale(2, RoundingMode.HALF_UP),
            "tax", tax.setScale(2, RoundingMode.HALF_UP),
            "shipping", shipping.setScale(2, RoundingMode.HALF_UP),
            "discount", order.getDiscountAmount().setScale(2, RoundingMode.HALF_UP),
            "total", order.getTotalAmount().setScale(2, RoundingMode.HALF_UP)
        ));
        out.put("address", Map.of(
            "id", order.getAddress().getId(),
            "fullName", order.getAddress().getFullName(),
            "phone", order.getAddress().getPhone(),
            "street", order.getAddress().getStreet(),
            "city", order.getAddress().getCity(),
            "state", order.getAddress().getState(),
            "pincode", order.getAddress().getPincode()
        ));
        out.put("items", items.stream().map(i -> Map.of(
            "id", i.getId(),
            "quantity", i.getQuantity(),
            "unitPrice", i.getPriceAtPurchase(),
            "lineTotal", i.getPriceAtPurchase().multiply(BigDecimal.valueOf(i.getQuantity())),
            "product", Map.of(
                "id", i.getProduct().getId(),
                "name", i.getProduct().getName(),
                "slug", i.getProduct().getSlug(),
                "image", i.getProduct().getImages() == null || i.getProduct().getImages().isEmpty() ? null : i.getProduct().getImages().get(0)
            )
        )).toList());
        out.put("payment", payment == null ? null : Map.of(
            "id", payment.getId(),
            "amount", payment.getAmount(),
            "status", payment.getStatus(),
            "razorpayPaymentId", payment.getRazorpayPaymentId()
        ));
        return out;
    }

    private boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpaySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] digest = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computed = bytesToHex(digest);
            return computed.equalsIgnoreCase(signature);
        } catch (Exception ex) {
            throw new InvalidRequestException("Unable to verify payment signature");
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
