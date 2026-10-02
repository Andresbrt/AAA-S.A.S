package com.aaasas.inmobiliaria.lead.infrastructure;

import com.aaasas.inmobiliaria.lead.domain.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.UUID;

public interface LeadRepository extends JpaRepository<Lead, UUID>, JpaSpecificationExecutor<Lead> {
    Page<Lead> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
