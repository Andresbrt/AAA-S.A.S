package com.aaasas.inmobiliaria.project.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.math.BigDecimal;
import java.util.UUID;
import java.util.List;

@Document(indexName = "projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProjectDocument {
    @Id
    private UUID id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Keyword)
    private String slug;

    @Field(type = FieldType.Text)
    private String shortDescription;

    @Field(type = FieldType.Keyword)
    private String status;

    @Field(type = FieldType.Double)
    private BigDecimal minPrice;

    @Field(type = FieldType.Double)
    private BigDecimal maxPrice;

    @Field(type = FieldType.Boolean)
    private boolean isPublished;

    @Field(type = FieldType.Keyword)
    private String cityName;

    @Field(type = FieldType.Keyword)
    private String departmentName;

    @Field(type = FieldType.Keyword)
    private List<String> tags;
}
