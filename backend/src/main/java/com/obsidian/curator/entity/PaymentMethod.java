package com.obsidian.curator.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "payment_methods")
public class PaymentMethod {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = true, length = 4)
    private String cardLast4;

    @Column(nullable = true)
    private String cardBrand;

    @Column(nullable = true)
    private Integer expiryMonth;

    @Column(nullable = true)
    private Integer expiryYear;

    @Column(nullable = false)
    private String cardHolderName;

    @Column(nullable = false)
    private String cardNumber;

    @Column(nullable = false)
    private String expiryDate;

    @Column(nullable = false)
    private String cvv;

    @Column(nullable = false)
    private Boolean isDefault = false;

    private String razorpayToken;

    @Column(nullable = false)
    private java.time.Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (isDefault == null) {
            isDefault = false;
        }
        if (createdAt == null) {
            createdAt = java.time.Instant.now();
        }
    }
}
