package com.obsidian.curator.repository;

import com.obsidian.curator.entity.Cart;
import com.obsidian.curator.entity.CartItem;
import com.obsidian.curator.entity.Product;
import com.obsidian.curator.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByCart(Cart cart);
    Optional<CartItem> findByCartAndProductAndVariant(Cart cart, Product product, ProductVariant variant);
    void deleteByCart(Cart cart);
}
