package com.obsidian.curator.controller;

import com.obsidian.curator.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final CatalogService catalogService;

    @GetMapping
    public Map<String, Object> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "12") Integer limit,
            @RequestParam(required = false, defaultValue = "newest") String sort
    ) {
        return catalogService.getProducts(q, category, featured, available, page, limit, sort);
    }

    @GetMapping("/featured")
    public List<Map<String, Object>> featured() {
        return catalogService.getFeaturedProducts();
    }

    @GetMapping("/new-arrivals")
    public List<Map<String, Object>> newArrivals() {
        return catalogService.getNewArrivals();
    }

    @GetMapping("/{slug}")
    public Map<String, Object> details(@PathVariable String slug) {
        return catalogService.getProductBySlug(slug);
    }
}
