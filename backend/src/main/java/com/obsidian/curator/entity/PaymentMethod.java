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

    @Column(nullable = false, length = 4)
    private String cardLast4;

    @Column(nullable = false)
    private String cardBrand;

    @Column(nullable = false)
    private Integer expiryMonth;

    @Column(nullable = false)
    private Integer expiryYear;

    @Column(nullable = false)
    private String cardholderName;

    @Column(nullable = false)
    private Boolean isPrimary = false;

    private String razorpayToken;

    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
        if (isPrimary == null) {
            isPrimary = false;
        }
    }
}
