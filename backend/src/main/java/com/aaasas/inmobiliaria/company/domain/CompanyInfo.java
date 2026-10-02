package com.aaasas.inmobiliaria.company.domain;

import com.aaasas.inmobiliaria.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
import org.hibernate.envers.Audited;

@Entity
@Table(name = "company_info")
@Audited
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CompanyInfo extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "about_us", columnDefinition = "TEXT")
    private String aboutUs;

    @Column(columnDefinition = "TEXT")
    private String mission;

    @Column(columnDefinition = "TEXT")
    private String vision;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "contact_address", length = 500)
    private String contactAddress;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "whatsapp_number", length = 50)
    private String whatsappNumber;

    @Column(name = "whatsapp_message", length = 500)
    private String whatsappMessage;

    // Campos SEO
    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    @Column(name = "meta_keywords", columnDefinition = "TEXT")
    private String metaKeywords;
}
