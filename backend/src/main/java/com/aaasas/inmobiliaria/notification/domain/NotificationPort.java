package com.aaasas.inmobiliaria.notification.domain;

/**
 * Port for sending notifications (email, etc.)
 */
public interface NotificationPort {
    void sendEmail(String to, String subject, String htmlBody);
}
