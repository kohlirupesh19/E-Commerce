package com.obsidian.curator.repository;

import com.obsidian.curator.entity.Cart;
import com.obsidian.curator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUser(User user);
}
