package staycay.dto;

import java.time.Instant;
import java.time.LocalDate;

public record ReservationHoldResponse(
        String holdToken,
        Long hotelId,
        Long roomId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        Instant expiresAt) {
}
