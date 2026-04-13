package com.obsidian.curator.repository;

import com.obsidian.curator.entity.Order;
import com.obsidian.curator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    Optional<Order> findByIdAndUser(UUID id, User user);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}
