package com.obsidian.curator.dto.request;

import com.obsidian.curator.entity.enums.AddressType;
import lombok.Data;

@Data
public class UpdateAddressRequest {
    private String fullName;
    private String phone;
    private AddressType addressType;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private Boolean isDefault;
}
