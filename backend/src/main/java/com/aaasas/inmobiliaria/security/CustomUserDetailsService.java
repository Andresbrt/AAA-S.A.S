package com.aaasas.inmobiliaria.security;

import com.aaasas.inmobiliaria.user.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmailAndDeletedAtIsNull(email)
            .map(CustomUserDetails::new)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }
}
