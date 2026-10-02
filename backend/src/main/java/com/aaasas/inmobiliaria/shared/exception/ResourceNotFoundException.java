package com.aaasas.inmobiliaria.shared.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String resource, String field, Object value) {
        super(
            String.format("%s no encontrado con %s: '%s'", resource, field, value),
            HttpStatus.NOT_FOUND,
            "RESOURCE_NOT_FOUND"
        );
    }
}
