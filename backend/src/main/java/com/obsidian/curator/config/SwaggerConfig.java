package com.obsidian.curator.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI().info(
                new Info()
                        .title("Obsidian Curator API")
                        .description("REST APIs for The Obsidian Curator")
                        .version("v1")
        );
    }
}
