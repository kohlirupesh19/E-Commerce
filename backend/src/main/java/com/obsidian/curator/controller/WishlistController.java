package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.WishlistToggleRequest;
import com.obsidian.curator.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<Map<String, Object>> getWishlist(Authentication authentication) {
        return wishlistService.getWishlist(authentication.getName());
    }

    @PostMapping("/{productId}")
    public List<Map<String, Object>> add(Authentication authentication, @PathVariable UUID productId) {
        return wishlistService.addToWishlist(authentication.getName(), productId);
    }

    @DeleteMapping("/{productId}")
    public List<Map<String, Object>> remove(Authentication authentication, @PathVariable UUID productId) {
        return wishlistService.removeFromWishlist(authentication.getName(), productId);
    }

    @PostMapping("/toggle")
    public Map<String, Object> toggle(Authentication authentication, @Valid @RequestBody WishlistToggleRequest request) {
        return wishlistService.toggleWishlist(authentication.getName(), request.productId());
    }

    @GetMapping("/share")
    public Map<String, Object> share(Authentication authentication) {
        return wishlistService.shareWishlist(authentication.getName());
    }
}
