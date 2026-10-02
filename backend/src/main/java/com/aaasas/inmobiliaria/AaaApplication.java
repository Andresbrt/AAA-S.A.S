package com.aaasas.inmobiliaria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(exclude = {
    org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchDataAutoConfiguration.class,
    org.springframework.boot.autoconfigure.data.elasticsearch.ElasticsearchRepositoriesAutoConfiguration.class,
    org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchClientAutoConfiguration.class
})
@EnableJpaAuditing
@EnableCaching
@EnableAsync
public class AaaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AaaApplication.class, args);
    }
}
