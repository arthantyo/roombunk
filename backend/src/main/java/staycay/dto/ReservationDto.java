package staycay.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import staycay.models.Reservation;
import staycay.models.enums.ReservationStatus;

public record ReservationDto(
                             Long id,
                             Long userId,
                             Long hostId,
                             Long listingId,
                             ListingSummaryDto listing,
                             LocalDate checkInDate,
                             LocalDate checkOutDate,
                             Integer adults,
                             Integer children,
                             Integer infants,
                             Integer pets,
                             String confirmationCode,
                             ReservationStatus status,
                             LocalDateTime createdAt) {

    public static ReservationDto from(Reservation reservation) {
        ListingSummaryDto listing = reservation.getListing() == null ? null : ListingSummaryDto.from(reservation.getListing());
        return new ReservationDto(
                reservation.getId(), reservation.getUser() != null ? reservation.getUser().getId() : null, reservation.getHost() != null ? reservation.getHost().getId() : null, reservation.getListing() != null ? reservation.getListing().getId() : null, listing, reservation.getCheckInDate(), reservation.getCheckOutDate(), reservation.getAdults(), reservation.getChildren(), reservation.getInfants(), reservation.getPets(), reservation.getConfirmationCode(), reservation.getStatus(), reservation.getCreatedAt());
    }

    public record ListingSummaryDto(
                                    Long id,
                                    String title,
                                    String description,
                                    String address,
                                    String city,
                                    String province,
                                    String country,
                                    Double basePrice) {

        public static ListingSummaryDto from(staycay.models.Listing listing) {
            return new ListingSummaryDto(
                    listing.getId(), listing.getTitle(), listing.getDescription(), listing.getAddress(), listing.getCity(), listing.getProvince(), listing.getCountry(), listing.getBasePrice());
        }
    }
}
