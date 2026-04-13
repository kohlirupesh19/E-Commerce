package com.obsidian.curator.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdateProductRequest {

    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stock;
    private String categorySlug;
    private String brand;
    private List<String> images;
    private Boolean isFeatured;
    private Boolean isAvailable;
}
