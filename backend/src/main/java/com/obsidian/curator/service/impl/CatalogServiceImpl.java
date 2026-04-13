package com.obsidian.curator.service.impl;

import com.obsidian.curator.dto.request.CreateCategoryRequest;
import com.obsidian.curator.dto.request.CreateProductRequest;
import com.obsidian.curator.dto.request.UpdateCategoryRequest;
import com.obsidian.curator.dto.request.UpdateProductRequest;
import com.obsidian.curator.entity.Category;
import com.obsidian.curator.entity.Product;
import com.obsidian.curator.exception.InvalidRequestException;
import com.obsidian.curator.exception.ResourceNotFoundException;
import com.obsidian.curator.repository.CategoryRepository;
import com.obsidian.curator.repository.ProductRepository;
import com.obsidian.curator.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public List<Map<String, Object>> getCategories() {
        return categoryRepository.findAll().stream().map(this::toCategoryMap).toList();
    }

    @Override
    public Map<String, Object> getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return toCategoryMap(category);
    }

    @Override
    public Map<String, Object> getProducts(String q, String category, Boolean featured, Boolean available, Integer page, Integer limit, String sort) {
        int safePage = page == null || page < 1 ? 1 : page;
        int safeLimit = limit == null || limit < 1 ? 12 : Math.min(limit, 50);

        List<Product> products = new ArrayList<>(productRepository.findAll());

        if (available != null) {
            products = products.stream().filter(p -> Objects.equals(p.getIsAvailable(), available)).toList();
        } else {
            products = products.stream().filter(p -> Boolean.TRUE.equals(p.getIsAvailable())).toList();
        }

        if (featured != null) {
            products = products.stream().filter(p -> Objects.equals(p.getIsFeatured(), featured)).toList();
        }

        if (category != null && !category.isBlank()) {
            String normalized = category.trim().toLowerCase(Locale.ROOT);
            products = products.stream()
                    .filter(p -> p.getCategory() != null && normalized.equals(p.getCategory().getSlug().toLowerCase(Locale.ROOT)))
                    .toList();
        }

        if (q != null && !q.isBlank()) {
            String query = q.trim().toLowerCase(Locale.ROOT);
            products = products.stream().filter(p -> {
                String name = p.getName() == null ? "" : p.getName().toLowerCase(Locale.ROOT);
                String brand = p.getBrand() == null ? "" : p.getBrand().toLowerCase(Locale.ROOT);
                String description = p.getDescription() == null ? "" : p.getDescription().toLowerCase(Locale.ROOT);
                return name.contains(query) || brand.contains(query) || description.contains(query);
            }).toList();
        }

        products = sortProducts(products, sort);

        int total = products.size();
        int start = Math.max(0, (safePage - 1) * safeLimit);
        int end = Math.min(total, start + safeLimit);
        List<Product> pageItems = start >= total ? List.of() : products.subList(start, end);

        return Map.of(
                "items", pageItems.stream().map(this::toProductSummaryMap).toList(),
                "pagination", Map.of(
                        "page", safePage,
                        "limit", safeLimit,
                        "total", total,
                        "totalPages", total == 0 ? 0 : (int) Math.ceil((double) total / safeLimit)
                )
        );
    }

    @Override
    public Map<String, Object> getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toProductDetailMap(product);
    }

    @Override
    public List<Map<String, Object>> getFeaturedProducts() {
        return productRepository.findTop8ByIsFeaturedTrueOrderByRatingAvgDesc().stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsAvailable()))
                .map(this::toProductSummaryMap)
                .toList();
    }

    @Override
    public List<Map<String, Object>> getNewArrivals() {
        return productRepository.findTop8ByOrderByCreatedAtDesc().stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsAvailable()))
                .map(this::toProductSummaryMap)
                .toList();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> search(String query) {
        return (List<Map<String, Object>>) getProducts(query, null, null, true, 1, 20, "relevance").get("items");
    }

    @Override
    @Transactional
    public Map<String, Object> createCategory(CreateCategoryRequest request) {
        validateCategorySlugUnique(request.getSlug(), null);

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setSlug(request.getSlug().trim().toLowerCase(Locale.ROOT));
        category.setImageUrl(request.getImageUrl());
        category.setIconName(request.getIconName());
        if (request.getParentSlug() != null && !request.getParentSlug().isBlank()) {
            category.setParent(getCategoryBySlugEntity(request.getParentSlug()));
        }

        categoryRepository.save(category);
        return toCategoryMap(category);
    }

    @Override
    @Transactional
    public Map<String, Object> updateCategory(UUID id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            category.setName(request.getName().trim());
        }
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String slug = request.getSlug().trim().toLowerCase(Locale.ROOT);
            validateCategorySlugUnique(slug, id);
            category.setSlug(slug);
        }
        if (request.getImageUrl() != null) {
            category.setImageUrl(request.getImageUrl());
        }
        if (request.getIconName() != null) {
            category.setIconName(request.getIconName());
        }
        if (request.getParentSlug() != null) {
            if (request.getParentSlug().isBlank()) {
                category.setParent(null);
            } else {
                category.setParent(getCategoryBySlugEntity(request.getParentSlug()));
            }
        }

        categoryRepository.save(category);
        return toCategoryMap(category);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public Map<String, Object> createProduct(CreateProductRequest request) {
        validateProductSlugUnique(request.getSlug(), null);

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setSlug(request.getSlug().trim().toLowerCase(Locale.ROOT));
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStock(request.getStock() == null ? 0 : request.getStock());
        product.setCategory(getCategoryBySlugEntity(request.getCategorySlug()));
        product.setBrand(request.getBrand());
        product.setImages(request.getImages() == null ? new ArrayList<>() : request.getImages());
        product.setIsFeatured(Boolean.TRUE.equals(request.getIsFeatured()));
        product.setIsAvailable(request.getIsAvailable() == null || request.getIsAvailable());

        productRepository.save(product);
        return toProductDetailMap(product);
    }

    @Override
    @Transactional
    public Map<String, Object> updateProduct(UUID id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            product.setName(request.getName().trim());
        }
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String slug = request.getSlug().trim().toLowerCase(Locale.ROOT);
            validateProductSlugUnique(slug, id);
            product.setSlug(slug);
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new InvalidRequestException("Price must be greater than 0");
            }
            product.setPrice(request.getPrice());
        }
        if (request.getDiscountPrice() != null) {
            if (request.getDiscountPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new InvalidRequestException("Discount price must be greater than 0");
            }
            product.setDiscountPrice(request.getDiscountPrice());
        }
        if (request.getStock() != null) {
            if (request.getStock() < 0) {
                throw new InvalidRequestException("Stock cannot be negative");
            }
            product.setStock(request.getStock());
        }
        if (request.getCategorySlug() != null && !request.getCategorySlug().isBlank()) {
            product.setCategory(getCategoryBySlugEntity(request.getCategorySlug()));
        }
        if (request.getBrand() != null) {
            product.setBrand(request.getBrand());
        }
        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }
        if (request.getIsAvailable() != null) {
            product.setIsAvailable(request.getIsAvailable());
        }

        productRepository.save(product);
        return toProductDetailMap(product);
    }

    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    private List<Product> sortProducts(List<Product> products, String sort) {
        String mode = sort == null ? "newest" : sort.toLowerCase(Locale.ROOT);
        Comparator<Product> comparator;

        comparator = switch (mode) {
            case "price_asc" -> Comparator.comparing(Product::getPrice, Comparator.nullsLast(BigDecimal::compareTo));
            case "price_desc" -> Comparator.comparing(Product::getPrice, Comparator.nullsLast(BigDecimal::compareTo)).reversed();
            case "rating" -> Comparator.comparing(Product::getRatingAvg, Comparator.nullsLast(BigDecimal::compareTo)).reversed();
            case "name" -> Comparator.comparing(Product::getName, Comparator.nullsLast(String::compareToIgnoreCase));
            default -> Comparator.comparing(Product::getCreatedAt, Comparator.nullsLast(java.time.Instant::compareTo)).reversed();
        };

        return products.stream().sorted(comparator).toList();
    }

    private Category getCategoryBySlugEntity(String slug) {
        return categoryRepository.findBySlug(slug.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private void validateCategorySlugUnique(String slug, UUID excludeId) {
        String normalized = slug.trim().toLowerCase(Locale.ROOT);
        categoryRepository.findBySlug(normalized).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new InvalidRequestException("Category slug already exists");
            }
        });
    }

    private void validateProductSlugUnique(String slug, UUID excludeId) {
        String normalized = slug.trim().toLowerCase(Locale.ROOT);
        productRepository.findBySlug(normalized).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new InvalidRequestException("Product slug already exists");
            }
        });
    }

    private Map<String, Object> toCategoryMap(Category category) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", category.getId());
        out.put("name", category.getName());
        out.put("slug", category.getSlug());
        out.put("parentSlug", category.getParent() == null ? null : category.getParent().getSlug());
        out.put("imageUrl", category.getImageUrl());
        out.put("iconName", category.getIconName());
        out.put("itemCount", category.getItemCount());
        return out;
    }

    private Map<String, Object> toProductSummaryMap(Product product) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", product.getId());
        out.put("name", product.getName());
        out.put("slug", product.getSlug());
        out.put("price", product.getPrice());
        out.put("discountPrice", product.getDiscountPrice());
        out.put("effectivePrice", product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice());
        out.put("stock", product.getStock());
        out.put("brand", product.getBrand());
        out.put("category", product.getCategory() == null ? null : toCategoryMap(product.getCategory()));
        out.put("primaryImage", product.getImages() == null || product.getImages().isEmpty() ? null : product.getImages().get(0));
        out.put("ratingAvg", product.getRatingAvg());
        out.put("ratingCount", product.getRatingCount());
        out.put("isFeatured", product.getIsFeatured());
        out.put("isAvailable", product.getIsAvailable());
        return out;
    }

    private Map<String, Object> toProductDetailMap(Product product) {
        Map<String, Object> out = new LinkedHashMap<>(toProductSummaryMap(product));
        out.put("description", product.getDescription());
        out.put("images", product.getImages() == null ? List.of() : product.getImages());
        out.put("createdAt", product.getCreatedAt());
        return out;
    }
}
