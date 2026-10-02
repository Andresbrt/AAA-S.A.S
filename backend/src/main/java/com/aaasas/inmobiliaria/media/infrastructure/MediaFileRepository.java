package com.aaasas.inmobiliaria.media.infrastructure;

import com.aaasas.inmobiliaria.media.domain.EntityType;
import com.aaasas.inmobiliaria.media.domain.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {
    List<MediaFile> findByEntityTypeAndEntityIdOrderByDisplayOrderAsc(EntityType entityType, UUID entityId);
}
