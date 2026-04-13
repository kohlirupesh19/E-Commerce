package com.obsidian.curator.repository;

import com.obsidian.curator.entity.Review;
import com.obsidian.curator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByProductId(UUID productId);
    Optional<Review> findByIdAndUser(UUID id, User user);
    Optional<Review> findByUserIdAndProductId(UUID userId, UUID productId);
}
