package com.aaasas.inmobiliaria.project.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "amenities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 100)
    private String icon;
}
