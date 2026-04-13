package com.obsidian.curator.service.impl;

import com.obsidian.curator.dto.request.CreateAddressRequest;
import com.obsidian.curator.dto.request.UpdateAddressRequest;
import com.obsidian.curator.dto.response.AddressDto;
import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.entity.Address;
import com.obsidian.curator.entity.User;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.repository.AddressRepository;
import com.obsidian.curator.repository.UserRepository;
import com.obsidian.curator.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    private User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @Override
    public List<AddressDto> getUserAddresses(String email) {
        User user = getUserByEmail(email);
        return addressRepository.findByUser(user).stream()
                .map(address -> modelMapper.map(address, AddressDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto getAddressById(String email, UUID addressId) {
        User user = getUserByEmail(email);
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        return modelMapper.map(address, AddressDto.class);
    }

    @Override
    @Transactional
    public AddressDto createAddress(String email, CreateAddressRequest request) {
        User user = getUserByEmail(email);
        
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            resetDefaultAddress(user);
        }

        Address address = modelMapper.map(request, Address.class);
        address.setUser(user);
        
        address = addressRepository.save(address);
        return modelMapper.map(address, AddressDto.class);
    }

    @Override
    @Transactional
    public AddressDto updateAddress(String email, UUID addressId, UpdateAddressRequest request) {
        User user = getUserByEmail(email);
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            resetDefaultAddress(user);
        }

        if (request.getFullName() != null) address.setFullName(request.getFullName());
        if (request.getPhone() != null) address.setPhone(request.getPhone());
        if (request.getAddressType() != null) address.setAddressType(request.getAddressType());
        if (request.getStreet() != null) address.setStreet(request.getStreet());
        if (request.getCity() != null) address.setCity(request.getCity());
        if (request.getState() != null) address.setState(request.getState());
        if (request.getPincode() != null) address.setPincode(request.getPincode());
        if (request.getIsDefault() != null) address.setIsDefault(request.getIsDefault());

        address = addressRepository.save(address);
        return modelMapper.map(address, AddressDto.class);
    }

    @Override
    @Transactional
    public MessageResponse deleteAddress(String email, UUID addressId) {
        User user = getUserByEmail(email);
        Address address = addressRepository.findByIdAndUser(addressId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        addressRepository.delete(address);
        return new MessageResponse("Address deleted successfully");
    }

    private void resetDefaultAddress(User user) {
        List<Address> addresses = addressRepository.findByUser(user);
        for (Address addr : addresses) {
            if (Boolean.TRUE.equals(addr.getIsDefault())) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }
}
