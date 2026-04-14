package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.OrderCreateRequest;
import com.obsidian.curator.dto.request.OrderVerifyPaymentRequest;
import com.obsidian.curator.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public Map<String, Object> create(Authentication authentication, @Valid @RequestBody OrderCreateRequest request) {
        return orderService.createOrder(authentication.getName(), request);
    }

    @PostMapping
    public Map<String, Object> createAlias(Authentication authentication, @Valid @RequestBody OrderCreateRequest request) {
        return create(authentication, request);
    }

    @PostMapping("/verify-payment")
    public Map<String, Object> verifyPayment(Authentication authentication, @Valid @RequestBody OrderVerifyPaymentRequest request) {
        return orderService.verifyPayment(authentication.getName(), request);
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyPaymentAlias(Authentication authentication, @Valid @RequestBody OrderVerifyPaymentRequest request) {
        return verifyPayment(authentication, request);
    }

    @GetMapping("/me")
    public List<Map<String, Object>> getMyOrders(Authentication authentication, @RequestParam(required = false) com.obsidian.curator.entity.enums.OrderStatus status) {
        return orderService.getMyOrders(authentication.getName(), status);
    }

    @GetMapping("/mine")
    public List<Map<String, Object>> myOrdersAlias(Authentication authentication) {
        return getMyOrders(authentication, null);
    }

    @GetMapping("/{id}")
    public Map<String, Object> byId(Authentication authentication, @PathVariable UUID id) {
        return orderService.getOrder(authentication.getName(), id);
    }

    @PostMapping("/{id}/cancel")
    public Map<String, Object> cancel(Authentication authentication, @PathVariable UUID id) {
        return orderService.cancelOrder(authentication.getName(), id);
    }

    @PostMapping("/{id}/cancel-order")
    public Map<String, Object> cancelAlias(Authentication authentication, @PathVariable UUID id) {
        return cancel(authentication, id);
    }

    @PostMapping("/{id}/return")
    public Map<String, Object> requestReturn(Authentication authentication, @PathVariable UUID id) {
        return orderService.requestReturn(authentication.getName(), id);
    }

    @PostMapping("/{id}/reorder")
    public Map<String, Object> reorder(Authentication authentication, @PathVariable UUID id) {
        return orderService.reorder(authentication.getName(), id);
    }

    @PostMapping("/{id}/re-order")
    public Map<String, Object> reorderAlias(Authentication authentication, @PathVariable UUID id) {
        return reorder(authentication, id);
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> invoice(Authentication authentication, @PathVariable UUID id) {
        byte[] bytes = orderService.generateInvoice(authentication.getName(), id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }
}
