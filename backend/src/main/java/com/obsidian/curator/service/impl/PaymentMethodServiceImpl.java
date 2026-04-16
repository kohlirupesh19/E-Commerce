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

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoField;
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
        return paymentMethodRepository.findByUser(user)
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
            existing.forEach(pm -> pm.setIsPrimary(false));
            paymentMethodRepository.saveAll(existing);
        }

        String normalizedCardNumber = request.getCardNumber().replaceAll("\\s+", "");
        if (normalizedCardNumber.length() < 4) {
            throw new ResourceNotFoundException("Invalid card number");
        }

        YearMonth expiry = parseExpiry(request.getExpiryDate());

        PaymentMethod pm = new PaymentMethod();
        pm.setUser(user);
        pm.setCardholderName(request.getCardHolderName());
        pm.setCardLast4(normalizedCardNumber.substring(normalizedCardNumber.length() - 4));
        pm.setCardBrand(detectBrand(normalizedCardNumber));
        pm.setExpiryMonth(expiry.getMonthValue());
        pm.setExpiryYear(expiry.getYear());
        pm.setIsPrimary(Boolean.TRUE.equals(request.getIsDefault()));

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
        String last4 = pm.getCardLast4() == null ? "0000" : pm.getCardLast4();
        String expiryDate = String.format("%02d/%02d", pm.getExpiryMonth(), pm.getExpiryYear() % 100);

        return PaymentMethodDto.builder()
                .id(pm.getId())
                .cardHolderName(pm.getCardholderName())
                .maskedCardNumber("**** **** **** " + last4)
                .expiryDate(expiryDate)
                .isDefault(pm.getIsPrimary())
                .build();
    }

    private YearMonth parseExpiry(String expiryDate) {
        String normalized = expiryDate == null ? "" : expiryDate.trim();
        DateTimeFormatter fourDigitYear = DateTimeFormatter.ofPattern("MM/uuuu");
        DateTimeFormatter twoDigitYear = new DateTimeFormatterBuilder()
                .appendPattern("MM/")
                .appendValueReduced(ChronoField.YEAR, 2, 2, 2000)
                .toFormatter();

        try {
            if (normalized.matches("\\d{2}/\\d{2}")) {
                return YearMonth.parse(normalized, twoDigitYear);
            }
            return YearMonth.parse(normalized, fourDigitYear);
        } catch (DateTimeParseException ex) {
            throw new ResourceNotFoundException("Invalid expiry date format. Use MM/YY");
        }
    }

    private String detectBrand(String cardNumber) {
        if (cardNumber.startsWith("4")) {
            return "VISA";
        }
        if (cardNumber.matches("^5[1-5].*")) {
            return "MASTERCARD";
        }
        if (cardNumber.matches("^3[47].*")) {
            return "AMEX";
        }
        if (cardNumber.matches("^6(?:011|5).*")) {
            return "DISCOVER";
        }
        return "CARD";
    }
}
