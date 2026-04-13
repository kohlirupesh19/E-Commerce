package com.obsidian.curator.controller;

import com.obsidian.curator.dto.request.CreateCategoryRequest;
import com.obsidian.curator.dto.request.CreateProductRequest;
import com.obsidian.curator.dto.request.UpdateCategoryRequest;
import com.obsidian.curator.dto.request.UpdateProductRequest;
import com.obsidian.curator.dto.response.MessageResponse;
import com.obsidian.curator.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCatalogController {

    private final CatalogService catalogService;

    @PostMapping("/categories")
    public Map<String, Object> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        return catalogService.createCategory(request);
    }

    @PutMapping("/categories/{id}")
    public Map<String, Object> updateCategory(@PathVariable UUID id, @RequestBody UpdateCategoryRequest request) {
        return catalogService.updateCategory(id, request);
    }

    @DeleteMapping("/categories/{id}")
    public MessageResponse deleteCategory(@PathVariable UUID id) {
        catalogService.deleteCategory(id);
        return new MessageResponse("Category deleted");
    }

    @PostMapping("/products")
    public Map<String, Object> createProduct(@Valid @RequestBody CreateProductRequest request) {
        return catalogService.createProduct(request);
    }

    @PutMapping("/products/{id}")
    public Map<String, Object> updateProduct(@PathVariable UUID id, @RequestBody UpdateProductRequest request) {
        return catalogService.updateProduct(id, request);
    }

    @DeleteMapping("/products/{id}")
    public MessageResponse deleteProduct(@PathVariable UUID id) {
        catalogService.deleteProduct(id);
        return new MessageResponse("Product deleted");
    }
}
