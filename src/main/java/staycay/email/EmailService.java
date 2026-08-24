package staycay.email;

import java.time.format.DateTimeFormatter;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import staycay.models.Reservation;

@Service
class EmailService {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("MMMM d, yyyy");

    private final JavaMailSender mailSender;

    EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendReservationConfirmationEmail(Reservation reservation) {
        if (reservation.getUser() == null || reservation.getUser().getEmail() == null
                || reservation.getUser().getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "Cannot send confirmation without a recipient email");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(reservation.getUser().getEmail());
        message.setSubject("Staycay reservation confirmation #" + reservation.getId());
        message.setText(formatConfirmation(reservation));

        mailSender.send(message);
    }

    private String formatConfirmation(Reservation reservation) {
        String guestName = reservation.getUser().getUsername();
        String hotelName = reservation.getRoom().getHotel().getName();

        return "Hello " + guestName + ",\n\n"
                + "Your Staycay reservation is confirmed.\n\n"
                + "Reservation: #" + reservation.getId() + "\n"
                + "Hotel: " + hotelName + "\n"
                + "Room: " + reservation.getRoom().getRoomType() + "\n"
                + "Check-in: " + reservation.getCheckInDate().format(DATE_FORMATTER) + "\n"
                + "Check-out: " + reservation.getCheckOutDate().format(DATE_FORMATTER) + "\n\n"
                + "Thank you for booking with Staycay!";
    }

}
