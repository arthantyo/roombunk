package staycay.email;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import staycay.models.Reservation;
import staycay.repositories.ReservationRepository;

@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final EmailService emailService;
    private final ReservationRepository reservationRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "reservations",
            groupId = "staycay-email-service"
    )
    public void handleReservationConfirmed(String message) throws Exception {

        ReservationEvent event =
                objectMapper.readValue(message, ReservationEvent.class);

        Reservation reservation =
                reservationRepository.findById(event.reservationId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Reservation not found: "
                                                + event.reservationId()
                                )
                        );

        emailService.sendReservationConfirmationEmail(
                reservation
        );
    }

    public record ReservationEvent(
            Long reservationId
    ) {}
}