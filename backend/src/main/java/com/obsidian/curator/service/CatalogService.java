package com.obsidian.curator.service;

import com.obsidian.curator.dto.request.CreateCategoryRequest;
import com.obsidian.curator.dto.request.CreateProductRequest;
import com.obsidian.curator.dto.request.UpdateCategoryRequest;
import com.obsidian.curator.dto.request.UpdateProductRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface CatalogService {
    List<Map<String, Object>> getCategories();
    Map<String, Object> getCategoryBySlug(String slug);
    Map<String, Object> getProducts(String q, String category, Boolean featured, Boolean available, Integer page, Integer limit, String sort);
    Map<String, Object> getProductBySlug(String slug);
    List<Map<String, Object>> getFeaturedProducts();
    List<Map<String, Object>> getNewArrivals();
    List<Map<String, Object>> search(String query);

    Map<String, Object> createCategory(CreateCategoryRequest request);
    Map<String, Object> updateCategory(UUID id, UpdateCategoryRequest request);
    void deleteCategory(UUID id);

    Map<String, Object> createProduct(CreateProductRequest request);
    Map<String, Object> updateProduct(UUID id, UpdateProductRequest request);
    void deleteProduct(UUID id);
}
