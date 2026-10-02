package com.aaasas.inmobiliaria.notification.application;

import com.aaasas.inmobiliaria.lead.application.LeadCreatedEvent;
import com.aaasas.inmobiliaria.notification.domain.NotificationPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationPort notificationPort;

    @Value("${app.admin.email:admin@aaasas.com}")
    private String adminEmail;

    @Async
    @EventListener
    public void onLeadCreated(LeadCreatedEvent event) {
        log.info("Sending lead notification for: {}", event.leadId());
        String body = String.format("""
            <h2>Nuevo lead recibido</h2>
            <p><strong>Nombre:</strong> %s</p>
            <p><strong>Email:</strong> %s</p>
            <p><strong>ID:</strong> %s</p>
            """, event.fullName(), event.email(), event.leadId());

        notificationPort.sendEmail(adminEmail, "Nuevo contacto: " + event.fullName(), body);
    }
}
