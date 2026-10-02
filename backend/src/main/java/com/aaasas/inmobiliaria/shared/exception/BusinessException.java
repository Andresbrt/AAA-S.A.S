package com.aaasas.inmobiliaria.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * Base class for all domain/business exceptions.
 * Each subclass maps to a specific HTTP status code.
 */
public abstract class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    protected BusinessException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
