package staycay.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import staycay.models.Reservation;
import staycay.models.ReservationStatus;

public record ReservationResponse(
        Long id,
        Long roomId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        ReservationStatus status,
        LocalDateTime createdAt) {

    public static ReservationResponse from(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getRoom().getId(),
                reservation.getCheckInDate(),
                reservation.getCheckOutDate(),
                reservation.getStatus(),
                reservation.getCreatedAt());
    }
}