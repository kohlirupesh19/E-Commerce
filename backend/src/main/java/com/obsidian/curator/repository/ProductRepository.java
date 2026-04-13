package com.obsidian.curator.repository;

import com.obsidian.curator.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findBySlug(String slug);
    List<Product> findTop8ByIsFeaturedTrueOrderByRatingAvgDesc();
    List<Product> findTop8ByOrderByCreatedAtDesc();
}
