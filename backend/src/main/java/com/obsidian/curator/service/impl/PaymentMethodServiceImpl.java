package com.obsidian.curator.service.impl;

import com.obsidian.curator.dto.request.CreatePaymentMethodRequest;
import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.dto.response.PaymentMethodDto;
import com.obsidian.curator.entity.PaymentMethod;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.repository.PaymentMethodRepository;
import com.obsidian.curator.repository.UserRepository;
import com.obsidian.curator.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    @Override
    public List<PaymentMethodDto> getUserPaymentMethods(String email) {
        User user = getUserByEmail(email);
        return paymentMethodRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentMethodDto createPaymentMethod(String email, CreatePaymentMethodRequest request) {
        User user = getUserByEmail(email);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<PaymentMethod> existing = paymentMethodRepository.findByUser(user);
            existing.forEach(pm -> pm.setIsDefault(false));
            paymentMethodRepository.saveAll(existing);
        }

        PaymentMethod pm = new PaymentMethod();
        pm.setUser(user);
        pm.setCardHolderName(request.getCardHolderName());
        pm.setCardNumber(request.getCardNumber());
        pm.setExpiryDate(request.getExpiryDate());
        pm.setCvv(request.getCvv());
        pm.setIsDefault(request.getIsDefault());

        PaymentMethod saved = paymentMethodRepository.save(pm);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public MessageResponse deletePaymentMethod(String email, UUID id) {
        User user = getUserByEmail(email);
        PaymentMethod pm = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));

        if (!pm.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Payment method not found");
        }

        paymentMethodRepository.delete(pm);
        return new MessageResponse("Payment method deleted");
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private PaymentMethodDto mapToDto(PaymentMethod pm) {
        String last4 = "0000";
        if (pm.getCardNumber() != null && pm.getCardNumber().length() >= 4) {
            last4 = pm.getCardNumber().substring(pm.getCardNumber().length() - 4);
        }

        return PaymentMethodDto.builder()
                .id(pm.getId())
                .cardHolderName(pm.getCardHolderName())
                .maskedCardNumber("**** **** **** " + last4)
                .expiryDate(pm.getExpiryDate())
                .isDefault(pm.getIsDefault())
                .build();
    }
}
