package staycay.dto;

import java.time.LocalDate;

public record CreatePaymentIntentRequest(
                                         Long listingId,
                                         LocalDate checkInDate,
                                         LocalDate checkOutDate,
                                         Integer adults,
                                         Integer children,
                                         Integer infants,
                                         Integer pets) {
}
