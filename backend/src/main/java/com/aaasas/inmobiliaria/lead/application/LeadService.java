package com.aaasas.inmobiliaria.lead.application;

import com.aaasas.inmobiliaria.lead.api.CreateLeadRequest;
import com.aaasas.inmobiliaria.lead.api.LeadResponse;
import com.aaasas.inmobiliaria.lead.api.UpdateLeadCrmRequest;
import com.aaasas.inmobiliaria.lead.domain.Lead;
import com.aaasas.inmobiliaria.lead.domain.LeadStatus;
import com.aaasas.inmobiliaria.lead.infrastructure.LeadRepository;
import com.aaasas.inmobiliaria.shared.exception.BusinessRuleException;
import com.aaasas.inmobiliaria.shared.exception.ResourceNotFoundException;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LeadService {

    private static final Logger log = LoggerFactory.getLogger(LeadService.class);
    private final LeadRepository leadRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public LeadResponse createPublicLead(CreateLeadRequest request) {
        // Anti-spam: honeypot check — bots fill invisible fields
        if (request.honeypot() != null && !request.honeypot().isBlank()) {
            log.warn("Honeypot triggered for lead from: {}", request.email());
            throw new BusinessRuleException("Solicitud rechazada.", "SPAM_DETECTED");
        }

        Lead lead = Lead.builder()
            .fullName(request.fullName())
            .email(request.email())
            .phone(request.phone())
            .message(request.message())
            .origin(request.origin())
            .projectId(request.projectId())
            .dataConsent(request.dataConsent())
            .honeypot(request.honeypot())
            .build();

        Lead saved = leadRepository.save(lead);
        log.info("New lead created: {}", saved.getId());

        // Publish event for email notification (async)
        eventPublisher.publishEvent(new LeadCreatedEvent(saved.getId(), saved.getFullName(), saved.getEmail()));

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<LeadResponse> findAll(int page, int size, String status) {
        Page<Lead> leads;
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by(Sort.Direction.DESC, "createdAt"));

        if (status != null) {
            leads = leadRepository.findAll(
                (root, query, cb) -> cb.equal(root.get("status"), LeadStatus.valueOf(status)),
                pageable
            );
        } else {
            leads = leadRepository.findAllByOrderByCreatedAtDesc(pageable);
        }

        List<LeadResponse> content = leads.getContent().stream().map(this::toResponse).toList();
        return PageResponse.of(leads, content);
    }

    @Transactional
    public void updateStatus(UUID id, String status) {
        Lead lead = leadRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        lead.setStatus(LeadStatus.valueOf(status));
        leadRepository.save(lead);
    }

    @Transactional
    public LeadResponse updateCrmDetails(UUID id, UpdateLeadCrmRequest request) {
        Lead lead = leadRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", id));
        
        if (request.status() != null) {
            lead.setStatus(LeadStatus.valueOf(request.status()));
        }
        if (request.assignedTo() != null) {
            lead.setAssignedTo(request.assignedTo());
        }
        if (request.internalNotes() != null) {
            lead.setInternalNotes(request.internalNotes());
        }

        return toResponse(leadRepository.save(lead));
    }

    private LeadResponse toResponse(Lead l) {
        return new LeadResponse(l.getId(), l.getFullName(), l.getEmail(), l.getPhone(),
            l.getMessage(), l.getOrigin(), l.getStatus().name(), l.isDataConsent(),
            l.getProjectId(), l.getAssignedTo(), l.getInternalNotes(), l.getCreatedAt());
    }
}
