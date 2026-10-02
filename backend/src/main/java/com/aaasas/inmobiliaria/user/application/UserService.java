package com.aaasas.inmobiliaria.user.application;

import com.aaasas.inmobiliaria.shared.exception.DuplicateResourceException;
import com.aaasas.inmobiliaria.shared.exception.ResourceNotFoundException;
import com.aaasas.inmobiliaria.user.api.CreateUserRequest;
import com.aaasas.inmobiliaria.user.api.UpdateUserRequest;
import com.aaasas.inmobiliaria.user.api.UserResponse;
import com.aaasas.inmobiliaria.user.domain.Role;
import com.aaasas.inmobiliaria.user.domain.User;
import com.aaasas.inmobiliaria.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
            .filter(u -> u.getDeletedAt() == null)
            .map(this::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        return userRepository.findById(id)
            .filter(u -> u.getDeletedAt() == null)
            .map(this::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Usuario", "email", request.email());
        }

        User user = User.builder()
            .email(request.email())
            .password(passwordEncoder.encode(request.password()))
            .name(request.name())
            .role(Role.valueOf(request.role()))
            .active(true)
            .build();

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));

        if (request.email() != null && !request.email().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.email())) {
                throw new DuplicateResourceException("Usuario", "email", request.email());
            }
            user.setEmail(request.email());
        }
        if (request.name() != null) user.setName(request.name());
        if (request.role() != null) user.setRole(Role.valueOf(request.role()));
        if (request.active() != null) user.setActive(request.active());

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(UUID id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        user.setDeletedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole().name(), user.isActive());
    }
}
