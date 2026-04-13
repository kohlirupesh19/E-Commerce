package com.obsidian.curator.service;

import com.obsidian.curator.dto.request.CartAddItemRequest;
import com.obsidian.curator.dto.request.CartUpdateItemRequest;

import java.util.Map;
import java.util.UUID;

public interface CartService {
    Map<String, Object> getCart(String email);
    Map<String, Object> addItem(String email, CartAddItemRequest request);
    Map<String, Object> updateItemQuantity(String email, UUID itemId, CartUpdateItemRequest request);
    Map<String, Object> removeItem(String email, UUID itemId);
    Map<String, Object> clearCart(String email);
}
