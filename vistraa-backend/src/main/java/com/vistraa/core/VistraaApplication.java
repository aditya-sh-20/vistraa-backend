package com.vistraa.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.vistraa")
@EntityScan(basePackages = "com.vistraa.ecommerce.model")
@EnableJpaRepositories(basePackages = "com.vistraa.ecommerce.repository")
public class VistraaApplication {

    public static void main(String[] args) {
        SpringApplication.run(VistraaApplication.class, args);
    }
}