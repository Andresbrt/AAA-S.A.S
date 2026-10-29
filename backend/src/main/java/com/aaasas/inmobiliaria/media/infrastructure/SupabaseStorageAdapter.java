package com.aaasas.inmobiliaria.media.infrastructure;

import com.aaasas.inmobiliaria.media.domain.FileStoragePort;
import com.aaasas.inmobiliaria.shared.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;

/**
 * Supabase Storage adapter using their REST API.
 * Supabase Storage is S3-compatible, so we use their HTTP API for simplicity.
 */
@Component
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "supabase")
public class SupabaseStorageAdapter implements FileStoragePort {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageAdapter.class);

    @Value("${app.supabase.url:}")
    private String supabaseUrl;

    @Value("${app.supabase.key:}")
    private String supabaseKey;

    @Value("${app.supabase.bucket:media}")
    private String bucket;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String upload(String key, InputStream inputStream, long contentLength, String contentType) {
        try {
            String url = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucket, key);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);
            headers.setContentType(org.springframework.http.MediaType.parseMediaType(contentType));

            byte[] fileBytes = inputStream.readAllBytes();
            HttpEntity<byte[]> entity = new HttpEntity<>(fileBytes, headers);

            restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return getPublicUrl(key);
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            log.error("Supabase Storage error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new FileStorageException("Error uploading file to Supabase: " + key + ". Detail: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Supabase Storage error: {}", e.getMessage(), e);
            throw new FileStorageException("Error uploading file to Supabase: " + key, e);
        }
    }

    @Override
    public void delete(String key) {
        try {
            String url = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, bucket, key);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);
            restTemplate.exchange(url, HttpMethod.DELETE, new HttpEntity<>(headers), String.class);
        } catch (Exception e) {
            log.warn("Error deleting file from Supabase: {} - {}", key, e.getMessage());
            // Do not throw so that it doesn't block subsequent operations (like uploading a new file)
        }
    }

    @Override
    public String getPublicUrl(String key) {
        return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, bucket, key);
    }

    @Override
    public String getPresignedUrl(String key, int expirationMinutes) {
        // Supabase signed URLs via API
        return String.format("%s/storage/v1/object/sign/%s/%s?expiresIn=%d",
            supabaseUrl, bucket, key, expirationMinutes * 60);
    }

    @Override
    public com.aaasas.inmobiliaria.media.api.PresignedUploadResponse createPresignedUploadUrl(String key, String contentType, int expirationMinutes) {
        if (supabaseUrl == null || supabaseUrl.isBlank() || supabaseKey == null || supabaseKey.isBlank()) {
            throw new FileStorageException("Supabase Storage no está configurado para subidas directas.");
        }
        try {
            String signUrl = String.format("%s/storage/v1/object/upload/sign/%s/%s", supabaseUrl, bucket, key);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>("{}", headers);
            ResponseEntity<String> response = restTemplate.exchange(signUrl, HttpMethod.POST, entity, String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new FileStorageException("Supabase no devolvió URL firmada: " + response.getStatusCode());
            }

            com.fasterxml.jackson.databind.JsonNode rootNode = new com.fasterxml.jackson.databind.ObjectMapper().readTree(response.getBody());
            String relativeUrl = rootNode.path("url").asText();
            if (relativeUrl.isBlank()) {
                throw new FileStorageException("Respuesta inválida de Supabase Storage: " + response.getBody());
            }

            String uploadUrl;
            if (relativeUrl.startsWith("/storage/v1")) {
                uploadUrl = supabaseUrl + relativeUrl;
            } else if (relativeUrl.startsWith("/")) {
                uploadUrl = supabaseUrl + "/storage/v1" + relativeUrl;
            } else {
                uploadUrl = supabaseUrl + "/storage/v1/" + relativeUrl;
            }

            String publicUrl = getPublicUrl(key);
            java.util.Map<String, String> requiredHeaders = java.util.Map.of("Content-Type", contentType);

            log.info("Generated Supabase presigned upload URL for key: {}", key);
            return new com.aaasas.inmobiliaria.media.api.PresignedUploadResponse(key, uploadUrl, publicUrl, "PUT", requiredHeaders);
        } catch (FileStorageException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error al generar URL firmada de Supabase para {}: {}", key, e.getMessage(), e);
            throw new FileStorageException("No fue posible generar la URL de subida directa: " + e.getMessage(), e);
        }
    }
}

