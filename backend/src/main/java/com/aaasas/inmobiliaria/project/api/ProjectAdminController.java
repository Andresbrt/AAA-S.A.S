package com.aaasas.inmobiliaria.project.api;

import com.aaasas.inmobiliaria.project.application.ProjectService;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/projects")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')")
@Tag(name = "Proyectos (Admin)", description = "Gestión administrativa de proyectos")
public class ProjectAdminController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Listar todos los proyectos (admin)")
    public ResponseEntity<PageResponse<ProjectSummaryResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(projectService.findAllAdmin(page, size));
    }

    @PostMapping
    @Operation(summary = "Crear proyecto")
    public ResponseEntity<ProjectDetailResponse> create(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDetailResponse created = projectService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar proyecto")
    public ResponseEntity<ProjectDetailResponse> update(@PathVariable UUID id,
                                                        @Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar proyecto (borrado lógico)")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/publish")
    @Operation(summary = "Publicar o despublicar proyecto")
    public ResponseEntity<Void> togglePublish(@PathVariable UUID id, @RequestParam boolean publish) {
        projectService.togglePublish(id, publish);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/featured")
    @Operation(summary = "Marcar o desmarcar como destacado")
    public ResponseEntity<Void> toggleFeatured(@PathVariable UUID id, @RequestParam boolean featured) {
        projectService.toggleFeatured(id, featured);
        return ResponseEntity.noContent().build();
    }
}
