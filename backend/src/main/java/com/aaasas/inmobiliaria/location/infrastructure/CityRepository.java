package com.aaasas.inmobiliaria.location.infrastructure;

import com.aaasas.inmobiliaria.location.domain.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;
import java.util.UUID;

public interface CityRepository extends JpaRepository<City, UUID> {
    @EntityGraph(attributePaths = "department")
    List<City> findAllByDepartmentId(UUID departmentId);

    @EntityGraph(attributePaths = "department")
    List<City> findAll();
}
