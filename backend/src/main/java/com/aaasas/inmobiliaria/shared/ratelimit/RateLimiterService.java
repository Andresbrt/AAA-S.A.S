package com.aaasas.inmobiliaria.shared.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> leadBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> brochureBuckets = new ConcurrentHashMap<>();

    private final int loginCapacity;
    private final int loginRefillTokens;
    private final int loginRefillSeconds;

    private final int leadCapacity;
    private final int leadRefillTokens;
    private final int leadRefillSeconds;

    private final int brochureCapacity;
    private final int brochureRefillTokens;
    private final int brochureRefillSeconds;

    public RateLimiterService(
        @Value("${app.rate-limit.login.capacity:10}") int loginCapacity,
        @Value("${app.rate-limit.login.refill-tokens:10}") int loginRefillTokens,
        @Value("${app.rate-limit.login.refill-duration-seconds:60}") int loginRefillSeconds,
        @Value("${app.rate-limit.lead.capacity:5}") int leadCapacity,
        @Value("${app.rate-limit.lead.refill-tokens:5}") int leadRefillTokens,
        @Value("${app.rate-limit.lead.refill-duration-seconds:60}") int leadRefillSeconds,
        @Value("${app.rate-limit.brochure.capacity:5}") int brochureCapacity,
        @Value("${app.rate-limit.brochure.refill-tokens:5}") int brochureRefillTokens,
        @Value("${app.rate-limit.brochure.refill-duration-seconds:60}") int brochureRefillSeconds
    ) {
        this.loginCapacity = loginCapacity;
        this.loginRefillTokens = loginRefillTokens;
        this.loginRefillSeconds = loginRefillSeconds;
        this.leadCapacity = leadCapacity;
        this.leadRefillTokens = leadRefillTokens;
        this.leadRefillSeconds = leadRefillSeconds;
        this.brochureCapacity = brochureCapacity;
        this.brochureRefillTokens = brochureRefillTokens;
        this.brochureRefillSeconds = brochureRefillSeconds;
    }

    public boolean tryConsumeLogin(String ip) {
        Bucket bucket = loginBuckets.computeIfAbsent(ip, k -> buildBucket(loginCapacity, loginRefillTokens, loginRefillSeconds));
        return bucket.tryConsume(1);
    }

    public boolean tryConsumeLead(String ip) {
        Bucket bucket = leadBuckets.computeIfAbsent(ip, k -> buildBucket(leadCapacity, leadRefillTokens, leadRefillSeconds));
        return bucket.tryConsume(1);
    }

    public boolean tryConsumeBrochure(String ip) {
        Bucket bucket = brochureBuckets.computeIfAbsent(ip, k -> buildBucket(brochureCapacity, brochureRefillTokens, brochureRefillSeconds));
        return bucket.tryConsume(1);
    }

    private Bucket buildBucket(int capacity, int refillTokens, int refillSeconds) {
        Bandwidth limit = Bandwidth.builder()
            .capacity(capacity)
            .refillGreedy(refillTokens, Duration.ofSeconds(refillSeconds))
            .build();
        return Bucket.builder().addLimit(limit).build();
    }
}
