package com.aaasas.inmobiliaria.media.domain;

import java.io.InputStream;

/**
 * Port for file storage. Implementations: S3, Supabase.
 * Switchable via app.storage.provider property.
 */
public interface FileStoragePort {

    /**
     * Upload a file and return its public URL.
     */
    String upload(String key, InputStream inputStream, long contentLength, String contentType);

    /**
     * Delete a file by its key.
     */
    void delete(String key);

    /**
     * Get a public URL for the file.
     */
    String getPublicUrl(String key);

    /**
     * Generate a pre-signed URL for temporary access.
     */
    String getPresignedUrl(String key, int expirationMinutes);
}
