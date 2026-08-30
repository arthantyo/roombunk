package staycay.security;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;

    @Value("${rate-limiting.auth.limit:10}")
    private long authLimit;
    @Value("${rate-limiting.auth.duration-seconds:60}")
    private long authDuration;

    @Value("${rate-limiting.sensitive.limit:15}")
    private long sensitiveLimit;
    @Value("${rate-limiting.sensitive.duration-seconds:60}")
    private long sensitiveDuration;

    @Value("${rate-limiting.general.limit:100}")
    private long generalLimit;
    @Value("${rate-limiting.general.duration-seconds:60}")
    private long generalDuration;

    private final Map<String, InMemoryBucket> inMemoryBuckets = new ConcurrentHashMap<>();

    public RateLimiterService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public enum BucketType {
        AUTH,
        SENSITIVE,
        GENERAL
    }

    public record RateLimiterResult(
            boolean allowed,
            long limit,
            long remaining,
            long resetSeconds
    ) {}

    public RateLimiterResult checkRateLimit(BucketType bucketType, String clientKey) {
        long limit;
        long durationSeconds;

        switch (bucketType) {
            case AUTH -> {
                limit = authLimit;
                durationSeconds = authDuration;
            }
            case SENSITIVE -> {
                limit = sensitiveLimit;
                durationSeconds = sensitiveDuration;
            }
            default -> {
                limit = generalLimit;
                durationSeconds = generalDuration;
            }
        }

        long nowSeconds = Instant.now().getEpochSecond();
        long windowIndex = nowSeconds / Math.max(1, durationSeconds);
        long resetSeconds = ((windowIndex + 1) * durationSeconds) - nowSeconds;
        if (resetSeconds <= 0) {
            resetSeconds = durationSeconds;
        }

        String redisKey = String.format("ratelimit:%s:%s:%d", bucketType.name().toLowerCase(), clientKey, windowIndex);

        try {
            Long currentCount = redisTemplate.opsForValue().increment(redisKey);
            if (currentCount != null && currentCount == 1) {
                redisTemplate.expire(redisKey, Duration.ofSeconds(durationSeconds * 2));
            }
            long count = (currentCount != null) ? currentCount : 1;
            boolean allowed = count <= limit;
            long remaining = Math.max(0, limit - count);
            return new RateLimiterResult(allowed, limit, remaining, resetSeconds);
        } catch (Exception e) {
            log.debug("Redis rate limiting unavailable, falling back to in-memory: {}", e.getMessage());
            return checkInMemory(bucketType.name().toLowerCase(), clientKey, windowIndex, limit, resetSeconds);
        }
    }

    private RateLimiterResult checkInMemory(
            String bucketName, String clientKey, long windowIndex, long limit, long resetSeconds) {
        String key = String.format("%s:%s:%d", bucketName, clientKey, windowIndex);

        if (inMemoryBuckets.size() > 5000) {
            inMemoryBuckets.entrySet().removeIf(entry -> entry.getValue().windowIndex < windowIndex - 2);
        }

        InMemoryBucket bucket = inMemoryBuckets.compute(key, (k, existing) -> {
            if (existing == null || existing.windowIndex != windowIndex) {
                return new InMemoryBucket(windowIndex, new AtomicLong(1));
            } else {
                existing.counter.incrementAndGet();
                return existing;
            }
        });

        long count = bucket.counter.get();
        boolean allowed = count <= limit;
        long remaining = Math.max(0, limit - count);
        return new RateLimiterResult(allowed, limit, remaining, resetSeconds);
    }

    private static class InMemoryBucket {
        final long windowIndex;
        final AtomicLong counter;

        InMemoryBucket(long windowIndex, AtomicLong counter) {
            this.windowIndex = windowIndex;
            this.counter = counter;
        }
    }
}
