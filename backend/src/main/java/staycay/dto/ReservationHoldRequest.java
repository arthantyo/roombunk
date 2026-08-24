package staycay.dto;

import java.time.LocalDate;

public record ReservationHoldRequest(
        Long roomId,
        LocalDate checkInDate,
        LocalDate checkOutDate) {
}
