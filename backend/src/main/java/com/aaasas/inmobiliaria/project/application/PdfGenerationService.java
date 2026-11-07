package com.aaasas.inmobiliaria.project.application;

import com.aaasas.inmobiliaria.project.api.ProjectDetailResponse;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.Deflater;

@Service
public class PdfGenerationService {

    private static final Logger log = LoggerFactory.getLogger(PdfGenerationService.class);

    /**
     * Comprime y optimiza un archivo PDF subido antes de almacenarlo en Supabase.
     * Elimina metadatos redundantes, objetos huérfanos y aplica compresión máxima (BEST_COMPRESSION / Full Compression)
     * sobre los streams de objetos y flujos del documento.
     */
    public byte[] compressPdf(byte[] inputPdfBytes) {
        if (inputPdfBytes == null || inputPdfBytes.length == 0) {
            return inputPdfBytes;
        }
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfReader reader = new PdfReader(new ByteArrayInputStream(inputPdfBytes));
            reader.removeUnusedObjects();

            PdfStamper stamper = new PdfStamper(reader, out, PdfWriter.VERSION_1_5);
            stamper.setFullCompression();
            stamper.getWriter().setCompressionLevel(Deflater.BEST_COMPRESSION);

            int totalPages = reader.getNumberOfPages();
            for (int i = 1; i <= totalPages; i++) {
                reader.setPageContent(i, reader.getPageContent(i), Deflater.BEST_COMPRESSION);
            }

            stamper.close();
            reader.close();

            byte[] compressed = out.toByteArray();
            if (compressed.length > 0 && compressed.length < inputPdfBytes.length) {
                log.info("Brochure PDF optimizado: {} KB -> {} KB (reducción del {}%)",
                    inputPdfBytes.length / 1024,
                    compressed.length / 1024,
                    Math.round((1.0 - ((double) compressed.length / inputPdfBytes.length)) * 100));
                return compressed;
            }
            return inputPdfBytes;
        } catch (Exception e) {
            log.warn("No se pudo comprimir el PDF, se conservará el archivo original: {}", e.getMessage());
            return inputPdfBytes;
        }
    }

    public byte[] generateProjectBrochure(ProjectDetailResponse project) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24);
            Paragraph title = new Paragraph(project.name(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Subtitle / Location
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 14, Font.ITALIC);
            Paragraph location = new Paragraph(
                String.format("Ubicación: %s, %s", project.cityName(), project.departmentName()), subFont
            );
            location.setAlignment(Element.ALIGN_CENTER);
            location.setSpacingAfter(30);
            document.add(location);

            // Description
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Paragraph desc = new Paragraph(project.longDescription() != null ? project.longDescription() : project.shortDescription(), bodyFont);
            desc.setSpacingAfter(20);
            document.add(desc);

            // Table for details
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            addTableRow(table, "Estado", project.status());
            addTableRow(table, "Precio Desde", project.minPrice() != null ? "$" + project.minPrice().toString() : "N/A");
            addTableRow(table, "Precio Hasta", project.maxPrice() != null ? "$" + project.maxPrice().toString() : "N/A");
            addTableRow(table, "Entrega Estimada", project.estimatedDelivery() != null ? project.estimatedDelivery().toString() : "Por definir");
            
            document.add(table);

            // Amenities
            if (project.amenities() != null && !project.amenities().isEmpty()) {
                document.add(new Paragraph("Comodidades:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
                com.lowagie.text.List list = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
                project.amenities().forEach(a -> list.add(new ListItem(a.name(), bodyFont)));
                document.add(list);
            }

            document.close();
            return out.toByteArray();
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error al generar el PDF del brochure", e);
        }
    }

    private void addTableRow(PdfPTable table, String key, String value) {
        PdfPCell cellKey = new PdfPCell(new Phrase(key, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)));
        cellKey.setPadding(8);
        table.addCell(cellKey);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, FontFactory.getFont(FontFactory.HELVETICA, 12)));
        cellValue.setPadding(8);
        table.addCell(cellValue);
    }
}
