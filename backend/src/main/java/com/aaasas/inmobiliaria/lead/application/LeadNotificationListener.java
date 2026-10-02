package com.aaasas.inmobiliaria.lead.application;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
@RequiredArgsConstructor
public class LeadNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(LeadNotificationListener.class);
    private final JavaMailSender mailSender;

    @Value("${admin.email:admin@aaasas.com}")
    private String adminEmail;

    @Async
    @EventListener
    public void handleLeadCreatedEvent(LeadCreatedEvent event) {
        log.info("Sending welcome email to lead: {}", event.email());
        try {
            // Send email to Lead
            SimpleMailMessage leadMessage = new SimpleMailMessage();
            leadMessage.setTo(event.email());
            leadMessage.setSubject("¡Gracias por tu interés en Grupo AAA!");
            leadMessage.setText("Hola " + event.fullName() + ",\n\n" +
                    "Hemos recibido tu solicitud de información. Un asesor comercial se pondrá en contacto contigo muy pronto.\n\n"
                    +
                    "Saludos,\nEl equipo de Grupo AAA S.A.S.");
            mailSender.send(leadMessage);

            // Send alert to Admin
            SimpleMailMessage adminMessage = new SimpleMailMessage();
            adminMessage.setTo(adminEmail);
            adminMessage.setSubject("🔥 Nuevo Lead Recibido: " + event.fullName());
            adminMessage.setText("Se ha registrado un nuevo lead en la plataforma.\n\n" +
                    "Nombre: " + event.fullName() + "\n" +
                    "Email: " + event.email() + "\n\n" +
                    "Revisa el CRM para más detalles.");
            mailSender.send(adminMessage);

            log.info("Emails sent successfully for lead {}", event.leadId());
        } catch (Exception e) {
            log.error("Failed to send emails for lead {}: {}", event.leadId(), e.getMessage());
        }
    }
}
