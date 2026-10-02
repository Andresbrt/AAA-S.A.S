package com.aaasas.inmobiliaria.media.infrastructure;

import com.aaasas.inmobiliaria.media.domain.FileStoragePort;
import com.aaasas.inmobiliaria.shared.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.time.Duration;

@Component
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "s3")
public class S3StorageAdapter implements FileStoragePort {

    private static final Logger log = LoggerFactory.getLogger(S3StorageAdapter.class);

    @Value("${aws.s3.bucket:aaasas-media}")
    private String bucket;

    @Value("${aws.s3.region:us-east-1}")
    private String region;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    private S3Client s3Client;
    private S3Presigner presigner;

    @PostConstruct
    public void init() {
        var credentials = StaticCredentialsProvider.create(
            AwsBasicCredentials.create(accessKey, secretKey)
        );
        this.s3Client = S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(credentials)
            .build();
        this.presigner = S3Presigner.builder()
            .region(Region.of(region))
            .credentialsProvider(credentials)
            .build();
        log.info("S3 Storage Adapter initialized for bucket: {}", bucket);
    }

    @Override
    public String upload(String key, InputStream inputStream, long contentLength, String contentType) {
        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(inputStream, contentLength));
            return getPublicUrl(key);
        } catch (Exception e) {
            throw new FileStorageException("Error uploading file to S3: " + key, e);
        }
    }

    @Override
    public void delete(String key) {
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        } catch (Exception e) {
            throw new FileStorageException("Error deleting file from S3: " + key, e);
        }
    }

    @Override
    public String getPublicUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key);
    }

    @Override
    public String getPresignedUrl(String key, int expirationMinutes) {
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(expirationMinutes))
            .getObjectRequest(r -> r.bucket(bucket).key(key))
            .build();
        return presigner.presignGetObject(presignRequest).url().toString();
    }
}
