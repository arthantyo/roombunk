package staycay.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import staycay.models.Reservation;
import staycay.models.ReservationStatus;

public record ReservationDto(
        Long id,
        Long userId,
        Long roomId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        ReservationStatus status,
        LocalDateTime createdAt) {

    public static ReservationDto from(Reservation reservation) {
        return new ReservationDto(
                reservation.getId(),
                reservation.getUser() != null ? reservation.getUser().getId() : null,
                reservation.getRoom() != null ? reservation.getRoom().getId() : null,
                reservation.getCheckInDate(),
                reservation.getCheckOutDate(),
                reservation.getStatus(),
                reservation.getCreatedAt());
    }
}
