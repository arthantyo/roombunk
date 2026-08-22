package staycay.email;

import org.springframework.stereotype.Service;

import staycay.models.Reservation;

@Service
public class EmailService {

    public void sendReservationConfirmation(
            String email,
            Reservation reservation
    ) {
        // TODO: send email
    }
}