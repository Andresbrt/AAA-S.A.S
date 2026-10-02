package com.aaasas.inmobiliaria.media.api;

import com.aaasas.inmobiliaria.media.application.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/media")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')")
@Tag(name = "Media (Admin)", description = "Gestión de archivos e imágenes")
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "Subir archivo")
    public ResponseEntity<MediaFileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam String mediaType,
            @RequestParam String entityType,
            @RequestParam UUID entityId,
            @RequestParam(required = false, defaultValue = "") String altText,
            @RequestParam(required = false, defaultValue = "0") int displayOrder) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(mediaService.upload(file, mediaType, entityType, entityId, altText, displayOrder));
    }

    @GetMapping
    @Operation(summary = "Listar archivos por entidad")
    public ResponseEntity<List<MediaFileResponse>> findByEntity(
            @RequestParam String entityType,
            @RequestParam UUID entityId) {
        return ResponseEntity.ok(mediaService.findByEntity(entityType, entityId));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar archivo")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        mediaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
