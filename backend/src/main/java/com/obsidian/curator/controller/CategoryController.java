package com.obsidian.curator.controller;

import com.obsidian.curator.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CatalogService catalogService;

    @GetMapping
    public List<Map<String, Object>> list() {
        return catalogService.getCategories();
    }

    @GetMapping("/{slug}")
    public Map<String, Object> details(@PathVariable String slug) {
        return catalogService.getCategoryBySlug(slug);
    }
}
