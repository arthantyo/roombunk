package staycay.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import staycay.models.ReservationPayment;

public interface ReservationPaymentRepository extends JpaRepository<ReservationPayment, Long> {
    Optional<ReservationPayment> findByStripePaymentIntentId(String stripePaymentIntentId);

    Optional<ReservationPayment> findByReservationId(Long reservationId);
}
