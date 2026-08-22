package staycay.kafka.events;

public record ReservationConfirmedEvent(
    Long reservationId,
    Long userId
) {
}
