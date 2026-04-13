package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.CreateAddressRequest;
import com.obsidian.curator.dto.request.UpdateAddressRequest;
import com.obsidian.curator.dto.response.AddressDto;
import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public List<AddressDto> getUserAddresses(Authentication authentication) {
        return addressService.getUserAddresses(authentication.getName());
    }

    @GetMapping("/{id}")
    public AddressDto getAddressById(Authentication authentication, @PathVariable UUID id) {
        return addressService.getAddressById(authentication.getName(), id);
    }

    @PostMapping
    public AddressDto createAddress(Authentication authentication, @Valid @RequestBody CreateAddressRequest request) {
        return addressService.createAddress(authentication.getName(), request);
    }

    @PutMapping("/{id}")
    public AddressDto updateAddress(Authentication authentication, @PathVariable UUID id, @Valid @RequestBody UpdateAddressRequest request) {
        return addressService.updateAddress(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    public MessageResponse deleteAddress(Authentication authentication, @PathVariable UUID id) {
        return addressService.deleteAddress(authentication.getName(), id);
    }
}
