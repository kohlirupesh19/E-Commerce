package com.obsidian.curator.service;

import com.obsidian.curator.dto.request.CreateAddressRequest;
import com.obsidian.curator.dto.request.UpdateAddressRequest;
import com.obsidian.curator.dto.response.AddressDto;
import com.obsidian.curator.dto.response.MessageResponse;

import java.util.List;
import java.util.UUID;

public interface AddressService {
    List<AddressDto> getUserAddresses(String email);
    AddressDto getAddressById(String email, UUID addressId);
    AddressDto createAddress(String email, CreateAddressRequest request);
    AddressDto updateAddress(String email, UUID addressId, UpdateAddressRequest request);
    MessageResponse deleteAddress(String email, UUID addressId);
}
