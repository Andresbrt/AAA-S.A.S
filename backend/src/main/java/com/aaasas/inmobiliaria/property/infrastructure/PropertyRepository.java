package com.aaasas.inmobiliaria.property.infrastructure;

import com.aaasas.inmobiliaria.property.domain.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PropertyRepository extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {

    Page<Property> findByProjectIdAndDeletedAtIsNull(UUID projectId, Pageable pageable);

    List<Property> findByProjectIdAndDeletedAtIsNullAndStatus(UUID projectId, com.aaasas.inmobiliaria.property.domain.PropertyStatus status);

    Optional<Property> findByIdAndDeletedAtIsNull(UUID id);
}
