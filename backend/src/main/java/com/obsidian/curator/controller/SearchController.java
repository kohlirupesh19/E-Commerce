package com.obsidian.curator.controller;

import com.obsidian.curator.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final CatalogService catalogService;

    @GetMapping
    public List<Map<String, Object>> search(@RequestParam("q") String q) {
        return catalogService.search(q);
    }
}
