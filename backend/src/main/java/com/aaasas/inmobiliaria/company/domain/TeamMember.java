package com.aaasas.inmobiliaria.company.domain;

import com.aaasas.inmobiliaria.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_members")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeamMember extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(nullable = false, length = 200)
    private String position;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
