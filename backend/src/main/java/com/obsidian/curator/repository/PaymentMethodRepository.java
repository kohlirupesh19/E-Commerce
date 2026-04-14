package com.obsidian.curator.repository;

import com.obsidian.curator.entity.PaymentMethod;
import com.obsidian.curator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {
    List<PaymentMethod> findByUser(User user);
    List<PaymentMethod> findByUserOrderByCreatedAtDesc(User user);
}
