package staycay.dto;

import java.time.LocalDateTime;

import staycay.models.enums.ReservationStatus;

public record ConversationResponse(
                                   Long reservationId,
                                   Long otherUserId,
                                   String otherUsername,
                                   String lastMessage,
                                   LocalDateTime lastMessageAt,
                                   ReservationStatus reservationStatus
) {
}