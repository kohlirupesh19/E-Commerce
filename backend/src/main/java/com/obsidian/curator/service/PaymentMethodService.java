package com.obsidian.curator.service;

import com.obsidian.curator.dto.request.CreatePaymentMethodRequest;
import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.dto.response.PaymentMethodDto;

import java.util.List;
import java.util.UUID;

public interface PaymentMethodService {
    List<PaymentMethodDto> getUserPaymentMethods(String email);
    PaymentMethodDto createPaymentMethod(String email, CreatePaymentMethodRequest request);
    MessageResponse deletePaymentMethod(String email, UUID id);
}
