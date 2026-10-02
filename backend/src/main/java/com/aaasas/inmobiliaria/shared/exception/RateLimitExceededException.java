package com.aaasas.inmobiliaria.shared.exception;

import org.springframework.http.HttpStatus;

public class RateLimitExceededException extends BusinessException {

    public RateLimitExceededException() {
        super("Demasiadas solicitudes. Intente de nuevo más tarde.", HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMIT_EXCEEDED");
    }
}
