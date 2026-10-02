package com.aaasas.inmobiliaria.project.domain;

import com.aaasas.inmobiliaria.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "lots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lot extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "lot_number", nullable = false)
    private Integer lotNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private LotStatus status = LotStatus.DISPONIBLE;

    @Column(name = "area_m2", precision = 10, scale = 2)
    private BigDecimal areaM2;

    @Column(name = "price_cop", precision = 15, scale = 2)
    private BigDecimal priceCop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}