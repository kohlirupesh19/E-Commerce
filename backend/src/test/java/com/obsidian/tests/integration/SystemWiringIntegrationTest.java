package com.obsidian.tests.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.obsidian.curator.ObsidianCuratorApplication;
import com.obsidian.curator.entity.Category;
import com.obsidian.curator.repository.CategoryRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Run with Maven: mvn -Dtest=SystemWiringIntegrationTest test
 */
@SpringBootTest(
    classes = ObsidianCuratorApplication.class,
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles({"it", "dev"})
class SystemWiringIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @AfterEach
    void cleanupInsertedTestCategories() {
        var toDelete = categoryRepository.findAll().stream()
                .filter(category -> category.getSlug() != null && category.getSlug().startsWith("it-wiring-"))
                .toList();
        categoryRepository.deleteAll(toDelete);
    }

    @Test
    void shouldReadSeededCategoriesThroughPublicApi() throws IOException {
        var seededCategories = categoryRepository.findAll();
        var seededSlugs = seededCategories.stream()
            .map(Category::getSlug)
            .collect(Collectors.toSet());

        assertThat(seededSlugs).contains("timepieces", "fashion", "jewelry");

        var response = restTemplate.exchange(
                "/api/categories",
                HttpMethod.GET,
                null,
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotBlank();

        JsonNode body = objectMapper.readTree(response.getBody());
        assertThat(body.isArray()).isTrue();
        assertThat(body).isNotEmpty();

        var apiSlugs = java.util.stream.StreamSupport.stream(body.spliterator(), false)
            .map(entry -> entry.path("slug").asText())
                .collect(Collectors.toSet());

        assertThat(apiSlugs).contains("timepieces", "fashion", "jewelry");
    }

    @Test
    void shouldServeRepositoryInsertedCategoryViaApi() throws IOException {
        var uniqueSlug = "it-wiring-" + UUID.randomUUID().toString().substring(0, 8);

        var category = new Category();
        category.setName("Integration Wiring Category");
        category.setSlug(uniqueSlug);
        category.setIconName("Layers");
        category.setImageUrl("https://example.com/wiring-category.jpg");
        categoryRepository.save(category);

        ResponseEntity<String> response = restTemplate.exchange(
                "/api/categories",
                HttpMethod.GET,
                null,
                String.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotBlank();

        JsonNode categoryRows = objectMapper.readTree(response.getBody());
        assertThat(categoryRows.isArray()).isTrue();
        assertThat(categoryRows).isNotEmpty();

        var slugs = java.util.stream.StreamSupport.stream(categoryRows.spliterator(), false)
            .map(row -> row.path("slug").asText())
            .collect(Collectors.toSet());
        assertThat(slugs).contains(uniqueSlug);

        var insertedRow = java.util.stream.StreamSupport.stream(categoryRows.spliterator(), false)
            .filter(row -> uniqueSlug.equals(row.path("slug").asText()))
            .findFirst();

        assertThat(insertedRow).isPresent();
        assertThat(insertedRow.get().path("name").asText()).isEqualTo("Integration Wiring Category");
    }
}
