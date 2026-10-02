package com.aaasas.inmobiliaria.shared.pagination;

import java.util.List;

/**
 * Standard paginated response DTO wrapping Spring's Page data.
 */
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {

    public static <T> PageResponse<T> of(org.springframework.data.domain.Page<T> springPage) {
        return new PageResponse<>(
            springPage.getContent(),
            springPage.getNumber(),
            springPage.getSize(),
            springPage.getTotalElements(),
            springPage.getTotalPages(),
            springPage.isFirst(),
            springPage.isLast()
        );
    }

    public static <T, R> PageResponse<R> of(org.springframework.data.domain.Page<T> springPage, List<R> mappedContent) {
        return new PageResponse<>(
            mappedContent,
            springPage.getNumber(),
            springPage.getSize(),
            springPage.getTotalElements(),
            springPage.getTotalPages(),
            springPage.isFirst(),
            springPage.isLast()
        );
    }
}
