package com.aaasas.inmobiliaria.company.application;

import com.aaasas.inmobiliaria.company.api.*;
import com.aaasas.inmobiliaria.company.domain.CompanyInfo;
import com.aaasas.inmobiliaria.company.infrastructure.CompanyInfoRepository;
import com.aaasas.inmobiliaria.company.infrastructure.TeamMemberRepository;
import com.aaasas.inmobiliaria.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyInfoRepository companyInfoRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Transactional(readOnly = true)
    @Cacheable("companyPublic")
    public CompanyPublicResponse getPublicInfo() {
        CompanyInfo info = companyInfoRepository.findAll().stream().findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("CompanyInfo", "id", "singleton"));

        CompanyInfoResponse companyDto = new CompanyInfoResponse(
            info.getId(), info.getName(), info.getAboutUs(), info.getMission(), info.getVision(),
            info.getContactEmail(), info.getContactPhone(), info.getContactAddress(), info.getLogoUrl(),
            info.getMetaTitle(), info.getMetaDescription(), info.getMetaKeywords()
        );

        List<TeamMemberResponse> teamDtos = teamMemberRepository.findByActiveTrueAndDeletedAtIsNullOrderByDisplayOrderAsc()
            .stream()
            .map(m -> new TeamMemberResponse(m.getId(), m.getFullName(), m.getPosition(), m.getBio(), m.getPhotoUrl(), m.getDisplayOrder()))
            .toList();

        return new CompanyPublicResponse(companyDto, teamDtos);
    }

    @Transactional
    @CacheEvict(value = "companyPublic", allEntries = true)
    public CompanyInfoResponse updateCompanyInfo(UUID id, CompanyInfoResponse request) {
        CompanyInfo info = companyInfoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("CompanyInfo", "id", id));

        if (request.name() != null) info.setName(request.name());
        if (request.aboutUs() != null) info.setAboutUs(request.aboutUs());
        if (request.mission() != null) info.setMission(request.mission());
        if (request.vision() != null) info.setVision(request.vision());
        if (request.contactEmail() != null) info.setContactEmail(request.contactEmail());
        if (request.contactPhone() != null) info.setContactPhone(request.contactPhone());
        if (request.contactAddress() != null) info.setContactAddress(request.contactAddress());
        if (request.metaTitle() != null) info.setMetaTitle(request.metaTitle());
        if (request.metaDescription() != null) info.setMetaDescription(request.metaDescription());
        if (request.metaKeywords() != null) info.setMetaKeywords(request.metaKeywords());

        CompanyInfo saved = companyInfoRepository.save(info);
        return new CompanyInfoResponse(saved.getId(), saved.getName(), saved.getAboutUs(),
            saved.getMission(), saved.getVision(), saved.getContactEmail(),
            saved.getContactPhone(), saved.getContactAddress(), saved.getLogoUrl(),
            saved.getMetaTitle(), saved.getMetaDescription(), saved.getMetaKeywords());
    }
}
