package com.aaasas.inmobiliaria.project.api;

import com.aaasas.inmobiliaria.project.application.PdfGenerationService;
import com.aaasas.inmobiliaria.project.application.ProjectService;
import com.aaasas.inmobiliaria.project.domain.ProjectDocument;
import com.aaasas.inmobiliaria.shared.pagination.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/projects")
@RequiredArgsConstructor
@Tag(name = "Proyectos (Público)", description = "Consulta pública de proyectos inmobiliarios")
public class ProjectPublicController {

    private final ProjectService projectService;
    private final PdfGenerationService pdfGenerationService;

    @GetMapping
    @Operation(summary = "Listar proyectos publicados", description = "Paginado con filtros por ciudad, estado, precio, destacado y búsqueda")
    public ResponseEntity<PageResponse<ProjectSummaryResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) UUID cityId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(projectService.findPublicProjects(page, size, cityId, status, minPrice, maxPrice, featured, search));
    }

    @GetMapping("/search/full-text")
    @Operation(summary = "Búsqueda ultra-rápida (Full-Text) usando Elasticsearch")
    public ResponseEntity<List<ProjectDocument>> searchElasticsearch(@RequestParam String query) {
        return ResponseEntity.ok(projectService.searchWithElasticsearch(query));
    }

    @GetMapping("/featured")
    @Operation(summary = "Proyectos destacados")
    public ResponseEntity<List<ProjectSummaryResponse>> findFeatured() {
        return ResponseEntity.ok(projectService.findFeatured());
    }

    @GetMapping("/sitemap")
    @Operation(summary = "Datos ligeros para generación de sitemap SEO")
    public ResponseEntity<List<ProjectSitemapDto>> getSitemap() {
        return ResponseEntity.ok(projectService.getSitemapData());
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Detalle de proyecto por slug")
    public ResponseEntity<ProjectDetailResponse> findBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(projectService.findBySlug(slug));
    }

    @GetMapping("/{slug}/brochure")
    @Operation(summary = "Descargar brochure en PDF del proyecto")
    public ResponseEntity<byte[]> downloadBrochure(@PathVariable String slug) {
        ProjectDetailResponse project = projectService.findBySlug(slug);
        byte[] pdfBytes = pdfGenerationService.generateProjectBrochure(project);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", project.slug() + "-brochure.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
