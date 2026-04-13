package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.CartAddItemRequest;
import com.obsidian.curator.dto.request.CartUpdateByItemRequest;
import com.obsidian.curator.dto.request.CartUpdateItemRequest;
import com.obsidian.curator.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public Map<String, Object> getCart(Authentication authentication) {
        return cartService.getCart(authentication.getName());
    }

    @PostMapping("/items")
    public Map<String, Object> addItem(Authentication authentication, @Valid @RequestBody CartAddItemRequest request) {
        return cartService.addItem(authentication.getName(), request);
    }

    @PostMapping("/add")
    public Map<String, Object> addItemAlias(Authentication authentication, @Valid @RequestBody CartAddItemRequest request) {
        return cartService.addItem(authentication.getName(), request);
    }

    @PatchMapping("/items/{itemId}")
    public Map<String, Object> updateItem(
            Authentication authentication,
            @PathVariable UUID itemId,
            @Valid @RequestBody CartUpdateItemRequest request
    ) {
        return cartService.updateItemQuantity(authentication.getName(), itemId, request);
    }

    @org.springframework.web.bind.annotation.PutMapping("/update")
    public Map<String, Object> updateItemAlias(
            Authentication authentication,
            @Valid @RequestBody CartUpdateByItemRequest request
    ) {
        CartUpdateItemRequest body = new CartUpdateItemRequest();
        body.setQuantity(request.quantity());
        return cartService.updateItemQuantity(authentication.getName(), request.itemId(), body);
    }

    @DeleteMapping("/items/{itemId}")
    public Map<String, Object> removeItem(Authentication authentication, @PathVariable UUID itemId) {
        return cartService.removeItem(authentication.getName(), itemId);
    }

    @DeleteMapping("/remove/{itemId}")
    public Map<String, Object> removeItemAlias(Authentication authentication, @PathVariable UUID itemId) {
        return cartService.removeItem(authentication.getName(), itemId);
    }

    @DeleteMapping("/clear")
    public Map<String, Object> clear(Authentication authentication) {
        return cartService.clearCart(authentication.getName());
    }
}
