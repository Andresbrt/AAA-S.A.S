package com.aaasas.inmobiliaria.property.domain;

import com.aaasas.inmobiliaria.project.domain.Project;
import com.aaasas.inmobiliaria.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "properties")
@Audited
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Property extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(length = 200)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PropertyType type;

    @Column(name = "built_area", precision = 10, scale = 2)
    private BigDecimal builtArea;

    @Column(name = "private_area", precision = 10, scale = 2)
    private BigDecimal privateArea;

    private Integer bedrooms;
    private Integer bathrooms;
    @Column(name = "parking_spots")
    private Integer parkingSpots;
    private Integer stratum;

    @Column(precision = 15, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PropertyStatus status = PropertyStatus.DISPONIBLE;

    @Column(name = "floor_or_tower", length = 50)
    private String floorOrTower;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
