package com.obsidian.curator.service.impl;

import com.obsidian.curator.dto.request.CartAddItemRequest;
import com.obsidian.curator.dto.request.CartUpdateItemRequest;
import com.obsidian.curator.entity.Cart;
import com.obsidian.curator.entity.CartItem;
import com.obsidian.curator.entity.Product;
import com.obsidian.curator.entity.ProductVariant;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.exception.InvalidRequestException;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.repository.CartItemRepository;
import com.obsidian.curator.repository.CartRepository;
import com.obsidian.curator.repository.ProductRepository;
import com.obsidian.curator.repository.ProductVariantRepository;
import com.obsidian.curator.repository.UserRepository;
import com.obsidian.curator.service.CartService;
import com.obsidian.curator.util.PriceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final PriceUtil priceUtil;

    @Override
    public Map<String, Object> getCart(String email) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        return mapCart(cart);
    }

    @Override
    @Transactional
    public Map<String, Object> addItem(String email, CartAddItemRequest request) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (!Boolean.TRUE.equals(product.getIsAvailable())) {
            throw new InvalidRequestException("Product is not available");
        }

        ProductVariant variant = null;
        if (request.getVariantId() != null) {
            variant = productVariantRepository.findById(request.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));
            if (!variant.getProduct().getId().equals(product.getId())) {
                throw new InvalidRequestException("Variant does not belong to product");
            }
        }

        CartItem item = cartItemRepository.findByCartAndProductAndVariant(cart, product, variant).orElseGet(() -> {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setVariant(variant);
            newItem.setQuantity(0);
            return newItem;
        });

        int nextQty = item.getQuantity() + request.getQuantity();
        validateStock(product, nextQty);
        item.setQuantity(nextQty);
        cartItemRepository.save(item);

        return mapCart(cart);
    }

    @Override
    @Transactional
    public Map<String, Object> updateItemQuantity(String email, UUID itemId, CartUpdateItemRequest request) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new InvalidRequestException("Cart item does not belong to user");
        }

        validateStock(item.getProduct(), request.getQuantity());
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return mapCart(cart);
    }

    @Override
    @Transactional
    public Map<String, Object> removeItem(String email, UUID itemId) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new InvalidRequestException("Cart item does not belong to user");
        }
        cartItemRepository.delete(item);

        return mapCart(cart);
    }

    @Override
    @Transactional
    public Map<String, Object> clearCart(String email) {
        User user = getUser(email);
        Cart cart = getOrCreateCart(user);
        cartItemRepository.deleteByCart(cart);
        return mapCart(cart);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    private void validateStock(Product product, int quantity) {
        if (product.getStock() != null && quantity > product.getStock()) {
            throw new InvalidRequestException("Requested quantity exceeds stock");
        }
    }

    private Map<String, Object> mapCart(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCart(cart);

        BigDecimal subtotal = items.stream().map(item -> {
            BigDecimal price = item.getProduct().getDiscountPrice() != null
                    ? item.getProduct().getDiscountPrice()
                    : item.getProduct().getPrice();
            return price.multiply(BigDecimal.valueOf(item.getQuantity()));
        }).reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal tax = priceUtil.tax(subtotal);
        BigDecimal shipping = subtotal.compareTo(BigDecimal.ZERO) > 0 ? new BigDecimal("15.00") : BigDecimal.ZERO;
        BigDecimal total = subtotal.add(tax).add(shipping);

        return Map.of(
                "items", items.stream().map(this::mapItem).toList(),
                "summary", Map.of(
                        "subtotal", subtotal,
                        "tax", tax,
                        "shipping", shipping,
                        "total", total,
                        "count", items.stream().mapToInt(CartItem::getQuantity).sum()
                )
        );
    }

    private Map<String, Object> mapItem(CartItem item) {
        BigDecimal unitPrice = item.getProduct().getDiscountPrice() != null
                ? item.getProduct().getDiscountPrice()
                : item.getProduct().getPrice();

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", item.getId());
        out.put("quantity", item.getQuantity());
        out.put("unitPrice", unitPrice);
        out.put("lineTotal", unitPrice.multiply(BigDecimal.valueOf(item.getQuantity())));
        out.put("product", Map.of(
                "id", item.getProduct().getId(),
                "name", item.getProduct().getName(),
                "slug", item.getProduct().getSlug(),
                "image", item.getProduct().getImages() == null || item.getProduct().getImages().isEmpty() ? null : item.getProduct().getImages().get(0)
        ));
        if (item.getVariant() != null) {
            out.put("variant", Map.of(
                    "id", item.getVariant().getId(),
                    "size", item.getVariant().getSize(),
                    "color", item.getVariant().getColor()
            ));
        }
        return out;
    }
}
