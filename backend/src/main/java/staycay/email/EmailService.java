package staycay.email;

import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import staycay.models.Reservation;

@Service
class EmailService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMMM d, yyyy");

    private final JavaMailSender mailSender;
    private final String senderAddress;

    EmailService(JavaMailSender mailSender, @Value("${spring.mail.from:}") String senderAddress) {
        this.mailSender = mailSender;
        this.senderAddress = senderAddress;
    }

    public void sendReservationConfirmationEmail(Reservation reservation) {
        if (reservation.getUser() == null || reservation.getUser().getEmail() == null || reservation.getUser().getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "Cannot send confirmation without a recipient email");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (!senderAddress.isBlank()) {
            message.setFrom(senderAddress);
        }
        message.setTo(reservation.getUser().getEmail());
        message.setSubject("Staycay reservation confirmation #" + reservation.getId());
        message.setText(formatConfirmation(reservation));

        mailSender.send(message);
    }

    private String formatConfirmation(Reservation reservation) {
        String guestName = reservation.getUser().getUsername();
        String listingTitle = reservation.getListing().getTitle();

        return "Hello " + guestName + ",\n\n" + "Your Staycay reservation is confirmed.\n\n" + "Reservation: #" + reservation.getId() + "\n" + "Listing: " + listingTitle + "\n" + "Check-in: " + reservation.getCheckInDate().format(DATE_FORMATTER) + "\n" + "Check-out: " + reservation.getCheckOutDate().format(DATE_FORMATTER) + "\n\n" + "Thank you for booking with Staycay!";
    }

}
