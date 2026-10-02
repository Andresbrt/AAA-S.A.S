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

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.key:}")
    private String supabaseKey;

    @Value("${supabase.bucket:media}")
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
        } catch (Exception e) {
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
            throw new FileStorageException("Error deleting file from Supabase: " + key, e);
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
}
