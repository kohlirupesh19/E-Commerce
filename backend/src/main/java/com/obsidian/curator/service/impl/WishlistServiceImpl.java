package com.obsidian.curator.service.impl;

import com.obsidian.curator.entity.Product;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.entity.WishlistItem;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.repository.ProductRepository;
import com.obsidian.curator.repository.UserRepository;
import com.obsidian.curator.repository.WishlistItemRepository;
import com.obsidian.curator.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishlistItemRepository wishlistItemRepository;

    @Override
    public List<Map<String, Object>> getWishlist(String email) {
        User user = getUser(email);
        return wishlistItemRepository.findByUser(user).stream().map(this::mapItem).toList();
    }

    @Override
    @Transactional
    public List<Map<String, Object>> addToWishlist(String email, UUID productId) {
        User user = getUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        wishlistItemRepository.findByUserAndProduct(user, product).orElseGet(() -> {
            WishlistItem item = new WishlistItem();
            item.setUser(user);
            item.setProduct(product);
            return wishlistItemRepository.save(item);
        });

        return wishlistItemRepository.findByUser(user).stream().map(this::mapItem).toList();
    }

    @Override
    @Transactional
    public List<Map<String, Object>> removeFromWishlist(String email, UUID productId) {
        User user = getUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        wishlistItemRepository.findByUserAndProduct(user, product).ifPresent(wishlistItemRepository::delete);
        return wishlistItemRepository.findByUser(user).stream().map(this::mapItem).toList();
    }

    @Override
    @Transactional
    public Map<String, Object> toggleWishlist(String email, UUID productId) {
        User user = getUser(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        boolean inWishlist = wishlistItemRepository.findByUserAndProduct(user, product)
                .map(item -> {
                    wishlistItemRepository.delete(item);
                    return false;
                })
                .orElseGet(() -> {
                    WishlistItem item = new WishlistItem();
                    item.setUser(user);
                    item.setProduct(product);
                    wishlistItemRepository.save(item);
                    return true;
                });

        return Map.of(
                "inWishlist", inWishlist,
                "wishlist", wishlistItemRepository.findByUser(user).stream().map(this::mapItem).toList()
        );
    }

    @Override
    public Map<String, Object> shareWishlist(String email) {
        return Map.of(
                "items", getWishlist(email),
                "count", getWishlist(email).size()
        );
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Map<String, Object> mapItem(WishlistItem item) {
        Product product = item.getProduct();
        return Map.of(
                "id", item.getId(),
                "product", Map.of(
                        "id", product.getId(),
                        "name", product.getName(),
                        "slug", product.getSlug(),
                        "price", product.getPrice(),
                        "discountPrice", product.getDiscountPrice(),
                        "image", product.getImages() == null || product.getImages().isEmpty() ? null : product.getImages().get(0),
                        "isAvailable", product.getIsAvailable()
                )
        );
    }
}
