package com.obsidian.curator.dto.request;

import lombok.Data;

@Data
public class UpdateCategoryRequest {

    private String name;
    private String slug;
    private String parentSlug;
    private String imageUrl;
    private String iconName;
}
