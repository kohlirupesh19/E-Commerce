package com.obsidian.curator.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMeRequest {
    private String name;
    private String phone;
    private LocalDate dob;
    private String gender;
    private String avatar;
}
