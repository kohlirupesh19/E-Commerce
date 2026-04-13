package com.obsidian.curator.dto.request;

import com.obsidian.curator.entity.enums.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAddressRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    private String phone;

    @NotNull
    private AddressType addressType;

    @NotBlank
    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String pincode;

    private Boolean isDefault = false;
}
