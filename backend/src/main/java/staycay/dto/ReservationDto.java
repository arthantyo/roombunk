package staycay.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import staycay.models.Reservation;
import staycay.models.enums.ReservationStatus;

public record ReservationDto(
                             Long id,
                             Long userId,
                             Long listingId,
                             LocalDate checkInDate,
                             LocalDate checkOutDate,
                             ReservationStatus status,
                             LocalDateTime createdAt) {

    public static ReservationDto from(Reservation reservation) {
        return new ReservationDto(
                reservation.getId(), reservation.getUser() != null ? reservation.getUser().getId() : null, reservation.getListing() != null ? reservation.getListing().getId() : null, reservation.getCheckInDate(), reservation.getCheckOutDate(), reservation.getStatus(), reservation.getCreatedAt());
    }
}
