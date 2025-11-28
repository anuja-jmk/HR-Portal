package com.HRPortal.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HR Portal")
                        .version("1.0")
                        .description("Employee CRUD Operations")
                        .contact(new Contact()
                                .name("Dev Team")
                                .email("dev-team@gmail.com")
                                .url("https://www.dev-team.com")
                        )
                );
    }
}
