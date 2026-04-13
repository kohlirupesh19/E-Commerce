package com.obsidian.curator.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface WishlistService {
    List<Map<String, Object>> getWishlist(String email);
    List<Map<String, Object>> addToWishlist(String email, UUID productId);
    List<Map<String, Object>> removeFromWishlist(String email, UUID productId);
    Map<String, Object> toggleWishlist(String email, UUID productId);
    Map<String, Object> shareWishlist(String email);
}
