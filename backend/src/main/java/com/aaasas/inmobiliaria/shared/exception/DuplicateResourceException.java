package com.aaasas.inmobiliaria.shared.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends BusinessException {

    public DuplicateResourceException(String resource, String field, Object value) {
        super(
            String.format("%s ya existe con %s: '%s'", resource, field, value),
            HttpStatus.CONFLICT,
            "DUPLICATE_RESOURCE"
        );
    }
}
