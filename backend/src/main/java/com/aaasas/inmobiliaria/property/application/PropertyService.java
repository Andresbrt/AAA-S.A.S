package com.aaasas.inmobiliaria.property.application;

import com.aaasas.inmobiliaria.project.domain.Project;
import com.aaasas.inmobiliaria.project.infrastructure.ProjectRepository;
import com.aaasas.inmobiliaria.property.api.CreatePropertyRequest;
import com.aaasas.inmobiliaria.property.api.PropertyResponse;
import com.aaasas.inmobiliaria.property.api.UpdatePropertyRequest;
import com.aaasas.inmobiliaria.property.domain.Property;
import com.aaasas.inmobiliaria.property.domain.PropertyStatus;
import com.aaasas.inmobiliaria.property.domain.PropertyType;
import com.aaasas.inmobiliaria.property.infrastructure.PropertyRepository;
import com.aaasas.inmobiliaria.shared.exception.BusinessException;
import com.aaasas.inmobiliaria.shared.exception.ResourceNotFoundException;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> findByProject(UUID projectId, int page, int size) {
        Page<Property> props = propertyRepository.findByProjectIdAndDeletedAtIsNull(
            projectId, PageRequest.of(page, Math.min(size, 50), Sort.by("price")));
        List<PropertyResponse> content = props.getContent().stream().map(this::toResponse).toList();
        return PageResponse.of(props, content);
    }

    @Transactional(readOnly = true)
    public PropertyResponse findById(UUID id) {
        return propertyRepository.findByIdAndDeletedAtIsNull(id)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Inmueble", "id", id));
    }

    private PropertyStatus parsePropertyStatus(String statusStr) {
        if (statusStr == null || statusStr.isBlank()) {
            return PropertyStatus.DISPONIBLE;
        }
        try {
            return PropertyStatus.valueOf(statusStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Estado de inmueble inválido: '" + statusStr + "'. Estados permitidos: DISPONIBLE, SEPARADO, VENDIDO"
            );
        }
    }

    private PropertyType parsePropertyType(String typeStr) {
        if (typeStr == null || typeStr.isBlank()) {
            return PropertyType.LOTE;
        }
        try {
            return PropertyType.valueOf(typeStr.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                "Tipo de inmueble inválido: '" + typeStr + "'."
            );
        }
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public PropertyResponse create(CreatePropertyRequest req) {
        Project project = projectRepository.findByIdAndDeletedAtIsNull(req.projectId())
            .orElseThrow(() -> new ResourceNotFoundException("Proyecto", "id", req.projectId()));

        Property property = Property.builder()
            .project(project)
            .name(req.name())
            .type(parsePropertyType(req.type()))
            .builtArea(req.builtArea())
            .privateArea(req.privateArea())
            .bedrooms(req.bedrooms())
            .bathrooms(req.bathrooms())
            .parkingSpots(req.parkingSpots())
            .stratum(req.stratum())
            .price(req.price())
            .status(parsePropertyStatus(req.status()))
            .floorOrTower(req.floorOrTower())
            .build();

        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public PropertyResponse update(UUID id, UpdatePropertyRequest req) {
        Property property = propertyRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inmueble", "id", id));

        if (req.name() != null) property.setName(req.name());
        if (req.type() != null) property.setType(parsePropertyType(req.type()));
        if (req.builtArea() != null) property.setBuiltArea(req.builtArea());
        if (req.privateArea() != null) property.setPrivateArea(req.privateArea());
        if (req.bedrooms() != null) property.setBedrooms(req.bedrooms());
        if (req.bathrooms() != null) property.setBathrooms(req.bathrooms());
        if (req.parkingSpots() != null) property.setParkingSpots(req.parkingSpots());
        if (req.stratum() != null) property.setStratum(req.stratum());
        if (req.price() != null) property.setPrice(req.price());
        if (req.status() != null) property.setStatus(parsePropertyStatus(req.status()));
        if (req.floorOrTower() != null) property.setFloorOrTower(req.floorOrTower());

        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public void updateStatus(UUID id, String status) {
        Property property = propertyRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inmueble", "id", id));
        property.setStatus(parsePropertyStatus(status));
        propertyRepository.save(property);
    }

    @Transactional
    @CacheEvict(value = {"publicProjects", "featuredProjects"}, allEntries = true)
    public void delete(UUID id) {
        Property prop = propertyRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Inmueble", "id", id));
        prop.setDeletedAt(LocalDateTime.now());
        propertyRepository.save(prop);
    }

    private PropertyResponse toResponse(Property p) {
        return new PropertyResponse(
            p.getId(), p.getProject().getId(), p.getProject().getName(), p.getName(),
            p.getType().name(), p.getBuiltArea(), p.getPrivateArea(),
            p.getBedrooms(), p.getBathrooms(), p.getParkingSpots(),
            p.getStratum(), p.getPrice(), p.getStatus().name(), p.getFloorOrTower()
        );
    }
}
