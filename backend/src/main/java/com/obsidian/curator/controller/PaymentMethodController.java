package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.CreatePaymentMethodRequest;
import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.dto.response.PaymentMethodDto;
import com.obsidian.curator.service.PaymentMethodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @GetMapping
    public List<PaymentMethodDto> getUserPaymentMethods(Authentication authentication) {
        return paymentMethodService.getUserPaymentMethods(authentication.getName());
    }

    @PostMapping
    public PaymentMethodDto createPaymentMethod(Authentication authentication, @Valid @RequestBody CreatePaymentMethodRequest request) {
        return paymentMethodService.createPaymentMethod(authentication.getName(), request);
    }

    @DeleteMapping("/{id}")
    public MessageResponse deletePaymentMethod(Authentication authentication, @PathVariable UUID id) {
        return paymentMethodService.deletePaymentMethod(authentication.getName(), id);
    }
}
