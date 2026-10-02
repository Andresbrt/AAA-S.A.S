package com.aaasas.inmobiliaria.project.infrastructure;

import com.aaasas.inmobiliaria.project.domain.ProjectDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ProjectSearchRepository extends ElasticsearchRepository<ProjectDocument, UUID> {
    List<ProjectDocument> findByNameOrShortDescription(String name, String shortDescription);
    List<ProjectDocument> findByIsPublishedTrueAndNameContainingIgnoreCase(String name);
}
