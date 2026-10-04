package com.aaasas.inmobiliaria.project.application;

import com.aaasas.inmobiliaria.location.domain.City;
import com.aaasas.inmobiliaria.location.infrastructure.CityRepository;
import com.aaasas.inmobiliaria.project.api.*;
import com.aaasas.inmobiliaria.project.domain.Amenity;
import com.aaasas.inmobiliaria.project.domain.Project;
import com.aaasas.inmobiliaria.project.domain.ProjectDocument;
import com.aaasas.inmobiliaria.project.domain.ProjectStatus;
import com.aaasas.inmobiliaria.project.infrastructure.AmenityRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectSearchRepository;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectSpecifications;
import com.aaasas.inmobiliaria.shared.exception.DuplicateResourceException;
import com.aaasas.inmobiliaria.shared.exception.ResourceNotFoundException;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import com.aaasas.inmobiliaria.shared.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final AmenityRepository amenityRepository;
    private final CityRepository cityRepository;
    
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private ProjectSearchRepository projectSearchRepository;

    // ── Public queries ────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ProjectDocument> searchWithElasticsearch(String query) {
        if (projectSearchRepository != null) {
            return projectSearchRepository.findByIsPublishedTrueAndNameContainingIgnoreCase(query);
        }
        return new ArrayList<>();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "publicProjects", key = "{#page, #size, #cityId, #status, #minPrice, #maxPrice, #featured, #search}")
    public PageResponse<ProjectSummaryResponse> findPublicProjects(
            int page, int size, UUID cityId, String status,
            BigDecimal minPrice, BigDecimal maxPrice, Boolean featured, String search) {

        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));

        ProjectStatus statusEnum = status != null ? ProjectStatus.valueOf(status) : null;

        Specification<Project> spec = Specification.where(ProjectSpecifications.isNotDeleted())
            .and(ProjectSpecifications.isPublished())
            .and(ProjectSpecifications.hasStatus(statusEnum))
            .and(ProjectSpecifications.inCity(cityId))
            .and(ProjectSpecifications.isFeatured(featured))
            .and(ProjectSpecifications.priceRange(minPrice, maxPrice))
            .and(ProjectSpecifications.searchByName(search))
            .and(ProjectSpecifications.fetchCity());

        Page<Project> projectPage = projectRepository.findAll(spec, pageable);
        List<ProjectSummaryResponse> content = projectPage.getContent().stream()
            .map(this::toSummary)
            .toList();

        return PageResponse.of(projectPage, content);
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse findBySlug(String slug) {
        Project project = projectRepository.findBySlugAndDeletedAtIsNullAndPublishedTrue(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "slug", slug));
        return toDetail(project);
    }

    @Transactional(readOnly = true)
    @Cacheable("featuredProjects")
    public List<ProjectSummaryResponse> findFeatured() {
        return projectRepository.findByFeaturedTrueAndPublishedTrueAndDeletedAtIsNullOrderByCreatedAtDesc()
            .stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectSitemapDto> getSitemapData() {
        return projectRepository.findAllPublishedForSitemap();
    }

    // ── Admin operations ──────────────────────────────────────

    @Transactional(readOnly = true)
    public PageResponse<ProjectSummaryResponse> findAllAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));
        Specification<Project> spec = Specification.where(ProjectSpecifications.isNotDeleted())
            .and(ProjectSpecifications.fetchCity());

        Page<Project> projectPage = projectRepository.findAll(spec, pageable);
        List<ProjectSummaryResponse> content = projectPage.getContent().stream()
            .map(this::toSummary).toList();
        return PageResponse.of(projectPage, content);
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public ProjectDetailResponse create(CreateProjectRequest request) {
        String slug = SlugUtil.toSlug(request.name());
        if (projectRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("Proyecto", "slug", slug);
        }

        Project project = Project.builder()
            .name(request.name())
            .slug(slug)
            .shortDescription(request.shortDescription())
            .longDescription(request.longDescription())
            .status(request.status() != null ? ProjectStatus.valueOf(request.status()) : ProjectStatus.BORRADOR)
            .minPrice(request.minPrice())
            .maxPrice(request.maxPrice())
            .estimatedDelivery(request.estimatedDelivery())
            .address(request.address())
            .latitude(request.latitude())
            .longitude(request.longitude())
            .mapUrl(request.mapUrl())
            .metaTitle(request.metaTitle())
            .metaDescription(request.metaDescription())
            .tags(request.tags() != null ? new ArrayList<>(request.tags()) : new ArrayList<>())
            .featured(request.featured() != null ? request.featured() : false)
            .published(request.published() != null ? request.published() : true) // Set true by default to be immediately visible
            .build();

        if (request.cityId() != null) {
            City city = cityRepository.findById(request.cityId())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad", "id", request.cityId()));
            project.setCity(city);
        }

        if (request.amenityIds() != null && !request.amenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findAllById(request.amenityIds());
            project.setAmenities(new HashSet<>(amenities));
        }

        Project saved = projectRepository.save(project);
        syncWithElasticsearch(saved);
        return toDetail(saved);
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public ProjectDetailResponse update(UUID id, UpdateProjectRequest request) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", id));

        if (request.name() != null) {
            project.setName(request.name());
            String newSlug = SlugUtil.toSlug(request.name());
            if (!newSlug.equals(project.getSlug()) && projectRepository.existsBySlug(newSlug)) {
                throw new DuplicateResourceException("Proyecto", "slug", newSlug);
            }
            project.setSlug(newSlug);
        }
        if (request.shortDescription() != null) project.setShortDescription(request.shortDescription());
        if (request.tags() != null) {
            project.setTags(new ArrayList<>(request.tags()));
        }
        if (request.featured() != null) project.setFeatured(request.featured());
        if (request.published() != null) project.setPublished(request.published());
        if (request.longDescription() != null) project.setLongDescription(request.longDescription());
        if (request.status() != null) project.setStatus(ProjectStatus.valueOf(request.status()));
        if (request.minPrice() != null) project.setMinPrice(request.minPrice());
        if (request.maxPrice() != null) project.setMaxPrice(request.maxPrice());
        if (request.estimatedDelivery() != null) project.setEstimatedDelivery(request.estimatedDelivery());
        if (request.address() != null) project.setAddress(request.address());
        if (request.latitude() != null) project.setLatitude(request.latitude());
        if (request.longitude() != null) project.setLongitude(request.longitude());
        if (request.mapUrl() != null) project.setMapUrl(request.mapUrl());
        if (request.metaTitle() != null) project.setMetaTitle(request.metaTitle());
        if (request.metaDescription() != null) project.setMetaDescription(request.metaDescription());

        if (request.cityId() != null) {
            City city = cityRepository.findById(request.cityId())
                .orElseThrow(() -> new ResourceNotFoundException("Ciudad", "id", request.cityId()));
            project.setCity(city);
        }

        if (request.amenityIds() != null) {
            List<Amenity> amenities = amenityRepository.findAllById(request.amenityIds());
            project.setAmenities(new HashSet<>(amenities));
        }

        Project saved = projectRepository.save(project);
        syncWithElasticsearch(saved);
        return toDetail(saved);
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public void delete(UUID id) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", id));
        project.setDeletedAt(LocalDateTime.now());
        projectRepository.save(project);
        if (projectSearchRepository != null) {
            projectSearchRepository.deleteById(id);
        }
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public void togglePublish(UUID id, boolean publish) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", id));
        project.setPublished(publish);
        Project saved = projectRepository.save(project);
        syncWithElasticsearch(saved);
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public void toggleFeatured(UUID id, boolean featured) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", id));
        project.setFeatured(featured);
        Project saved = projectRepository.save(project);
        syncWithElasticsearch(saved);
    }

    // ── Mappers ───────────────────────────────────────────────

    private String extractMediaUrl(Project p, com.aaasas.inmobiliaria.media.domain.MediaType type) {
        if (p.getMediaFiles() == null) return null;
        return p.getMediaFiles().stream()
            .filter(m -> m.getMediaType() == type)
            .findFirst()
            .map(com.aaasas.inmobiliaria.media.domain.MediaFile::getUrl)
            .orElse(null);
    }

    private String extractMainImage(Project p) {
        String main = extractMediaUrl(p, com.aaasas.inmobiliaria.media.domain.MediaType.MAIN_IMAGE);
        return main != null ? main : extractMediaUrl(p, com.aaasas.inmobiliaria.media.domain.MediaType.IMAGE);
    }

    private List<String> extractGalleryUrls(Project p) {
        if (p.getMediaFiles() == null) return new ArrayList<>();
        return p.getMediaFiles().stream()
            .filter(m -> m.getMediaType() == com.aaasas.inmobiliaria.media.domain.MediaType.GALLERY_IMAGE)
            .map(com.aaasas.inmobiliaria.media.domain.MediaFile::getUrl)
            .toList();
    }

    private ProjectSummaryResponse toSummary(Project p) {
        return new ProjectSummaryResponse(
            p.getId(), p.getName(), p.getSlug(), p.getShortDescription(),
            p.getStatus().name(), p.getMinPrice(), p.getMaxPrice(),
            p.getCity() != null ? p.getCity().getName() : null,
            p.getCity() != null && p.getCity().getDepartment() != null ? p.getCity().getDepartment().getName() : null,
            p.isFeatured(), p.getMetaTitle(), p.getEstimatedDelivery(), p.getMapUrl(),
            extractMainImage(p),
            extractMediaUrl(p, com.aaasas.inmobiliaria.media.domain.MediaType.BANNER_IMAGE),
            extractMediaUrl(p, com.aaasas.inmobiliaria.media.domain.MediaType.LOGO),
            extractGalleryUrls(p),
            p.getTags() != null ? new ArrayList<>(p.getTags()) : new ArrayList<>()
        );
    }

    private ProjectDetailResponse toDetail(Project p) {
        List<AmenityResponse> amenityDtos = p.getAmenities().stream()
            .map(a -> new AmenityResponse(a.getId(), a.getName(), a.getIcon()))
            .toList();

        return new ProjectDetailResponse(
            p.getId(), p.getName(), p.getSlug(),
            p.getShortDescription(), p.getLongDescription(),
            p.getStatus().name(), p.getMinPrice(), p.getMaxPrice(),
            p.getEstimatedDelivery(), p.getAddress(),
            p.getLatitude(), p.getLongitude(), p.getMapUrl(),
            p.isFeatured(), p.isPublished(),
            p.getMetaTitle(), p.getMetaDescription(),
            p.getCity() != null ? p.getCity().getName() : null,
            p.getCity() != null && p.getCity().getDepartment() != null ? p.getCity().getDepartment().getName() : null,
            extractMainImage(p),
            extractMediaUrl(p, com.aaasas.inmobiliaria.media.domain.MediaType.BANNER_IMAGE),
            extractMediaUrl(p, com.aaasas.inmobiliaria.media.domain.MediaType.LOGO),
            extractMediaUrl(p, com.aaasas.inmobiliaria.media.domain.MediaType.BROCHURE),
            extractGalleryUrls(p),
            amenityDtos,
            p.getTags() != null ? new ArrayList<>(p.getTags()) : new ArrayList<>()
        );
    }

    private void syncWithElasticsearch(Project project) {
        if (projectSearchRepository == null) return;
        ProjectDocument doc = ProjectDocument.builder()
            .id(project.getId())
            .name(project.getName())
            .slug(project.getSlug())
            .shortDescription(project.getShortDescription())
            .status(project.getStatus() != null ? project.getStatus().name() : null)
            .minPrice(project.getMinPrice())
            .maxPrice(project.getMaxPrice())
            .isPublished(project.isPublished())
            .cityName(project.getCity() != null ? project.getCity().getName() : null)
            .departmentName(project.getCity() != null && project.getCity().getDepartment() != null 
                            ? project.getCity().getDepartment().getName() : null)
            .tags(project.getTags() != null ? new ArrayList<>(project.getTags()) : new ArrayList<>())
            .build();
        projectSearchRepository.save(doc);
    }
}
