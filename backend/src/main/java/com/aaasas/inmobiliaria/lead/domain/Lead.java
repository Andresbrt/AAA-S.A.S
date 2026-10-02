package com.aaasas.inmobiliaria.lead.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "leads")
@Audited
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lead {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(length = 50)
    private String origin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private LeadStatus status = LeadStatus.NUEVO;

    @Column(name = "data_consent", nullable = false)
    @Builder.Default
    private boolean dataConsent = false;

    @Column(length = 255)
    private String honeypot;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "assigned_to")
    private UUID assignedTo;

    @Column(name = "internal_notes", columnDefinition = "TEXT")
    private String internalNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private UUID updatedBy;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
