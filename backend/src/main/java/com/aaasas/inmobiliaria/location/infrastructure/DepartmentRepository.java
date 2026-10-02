package com.aaasas.inmobiliaria.location.infrastructure;

import com.aaasas.inmobiliaria.location.domain.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {}
