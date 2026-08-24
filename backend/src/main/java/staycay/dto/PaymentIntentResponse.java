package staycay.dto;

public record PaymentIntentResponse(
        String clientSecret,
        String idempotencyKey,
        long amount,
        String currency) {
}
