package com.obsidian.curator.repository;

import com.obsidian.curator.entity.Product;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {
    List<WishlistItem> findByUser(User user);
    Optional<WishlistItem> findByUserAndProduct(User user, Product product);
}
