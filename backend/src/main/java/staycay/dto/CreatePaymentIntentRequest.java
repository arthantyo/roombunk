package staycay.dto;

import java.time.LocalDate;

public record CreatePaymentIntentRequest(
        Long hotelId,
        Long roomId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        String holdToken) {
}
