package com.obsidian.curator.repository;

import com.obsidian.curator.entity.PaymentMethod;
import com.obsidian.curator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {
    List<PaymentMethod> findByUser(User user);
    Optional<PaymentMethod> findByIdAndUser(UUID id, User user);
}
