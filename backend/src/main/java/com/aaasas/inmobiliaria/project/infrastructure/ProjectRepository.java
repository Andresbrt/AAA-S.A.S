package com.aaasas.inmobiliaria.project.infrastructure;

import com.aaasas.inmobiliaria.project.api.ProjectSitemapDto;
import com.aaasas.inmobiliaria.project.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID>, JpaSpecificationExecutor<Project> {

    Optional<Project> findByIdAndDeletedAtIsNull(UUID id);

    List<Project> findByFeaturedTrueAndPublishedTrueAndDeletedAtIsNullOrderByCreatedAtDesc();

    Optional<Project> findBySlugAndDeletedAtIsNullAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT new com.aaasas.inmobiliaria.project.api.ProjectSitemapDto(p.slug, p.updatedAt) FROM Project p WHERE p.published = true AND p.deletedAt IS NULL")
    List<ProjectSitemapDto> findAllPublishedForSitemap();
}