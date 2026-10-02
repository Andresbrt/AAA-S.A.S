package com.aaasas.inmobiliaria.user.domain;

import com.aaasas.inmobiliaria.shared.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "failed_attempts", nullable = false)
    @Builder.Default
    private int failedAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public boolean isAccountLocked() {
        return lockedUntil != null && lockedUntil.isAfter(LocalDateTime.now());
    }

    public void incrementFailedAttempts() {
        this.failedAttempts++;
    }

    public void resetFailedAttempts() {
        this.failedAttempts = 0;
        this.lockedUntil = null;
    }

    public void lock(int lockMinutes) {
        this.lockedUntil = LocalDateTime.now().plusMinutes(lockMinutes);
    }
}
