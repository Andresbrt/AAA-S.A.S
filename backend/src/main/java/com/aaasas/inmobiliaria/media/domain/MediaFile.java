package com.aaasas.inmobiliaria.media.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "media_files")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MediaFile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "file_key", nullable = false, length = 500)
    private String fileKey;

    @Column(nullable = false, length = 1000)
    private String url;

    @Column(name = "original_name", length = 300)
    private String originalName;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false, length = 20)
    private MediaType mediaType;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    @Column(name = "alt_text", length = 300)
    private String altText;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false, length = 30)
    private EntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private UUID createdBy;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
