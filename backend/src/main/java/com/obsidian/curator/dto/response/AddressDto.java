package com.obsidian.curator.dto.response;

import com.obsidian.curator.entity.enums.AddressType;
import lombok.Data;

import java.util.UUID;

@Data
public class AddressDto {
    private UUID id;
    private String fullName;
    private String phone;
    private AddressType addressType;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private Boolean isDefault;
}
