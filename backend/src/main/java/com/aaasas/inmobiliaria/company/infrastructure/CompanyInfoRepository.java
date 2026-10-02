package com.aaasas.inmobiliaria.company.infrastructure;

import com.aaasas.inmobiliaria.company.domain.CompanyInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CompanyInfoRepository extends JpaRepository<CompanyInfo, UUID> {}
