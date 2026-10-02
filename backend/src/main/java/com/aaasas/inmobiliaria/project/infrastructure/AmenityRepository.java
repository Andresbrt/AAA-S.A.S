package com.aaasas.inmobiliaria.project.infrastructure;

import com.aaasas.inmobiliaria.project.domain.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AmenityRepository extends JpaRepository<Amenity, UUID> {}
