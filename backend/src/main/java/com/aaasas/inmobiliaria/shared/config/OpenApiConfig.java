package com.aaasas.inmobiliaria.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "Bearer JWT";
        return new OpenAPI()
            .info(new Info()
                .title("AAA S.A.S. Inmobiliaria API")
                .version("1.0.0")
                .description("API REST para la plataforma inmobiliaria de AAA S.A.S. — Proyectos campestres y costeros en el Caribe colombiano.")
                .contact(new Contact()
                    .name("AAA S.A.S.")
                    .email("dev@aaasas.com")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
