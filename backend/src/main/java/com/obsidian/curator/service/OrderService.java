package com.obsidian.curator.service;

import com.obsidian.curator.dto.request.OrderCreateRequest;
import com.obsidian.curator.dto.request.OrderVerifyPaymentRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface OrderService {
    Map<String, Object> createOrder(String email, OrderCreateRequest request);
    Map<String, Object> verifyPayment(String email, OrderVerifyPaymentRequest request);
    Map<String, Object> getOrder(String email, UUID orderId);
    List<Map<String, Object>> getMyOrders(String email);
    Map<String, Object> cancelOrder(String email, UUID orderId);
    Map<String, Object> requestReturn(String email, UUID orderId);
    Map<String, Object> reorder(String email, UUID orderId);
    byte[] generateInvoice(String email, UUID orderId);
}
