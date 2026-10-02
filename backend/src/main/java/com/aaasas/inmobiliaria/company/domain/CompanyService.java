package com.aaasas.inmobiliaria.company.domain;

import com.aaasas.inmobiliaria.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.envers.Audited;

import java.util.UUID;

@Entity
@Table(name = "company_services")
@Audited
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanyService extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String icon;

    @Column(name = "display_order")
    private Integer displayOrder;
}
