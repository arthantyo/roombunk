package staycay.kafka.events;

import java.time.LocalDate;

public record ReservationConfirmedEvent(
                                        Long reservationId,
                                        Long userId,
                                        Long listingId,
                                        String userEmail,
                                        LocalDate checkInDate,
                                        LocalDate checkOutDate,
                                        String status
) {


}
