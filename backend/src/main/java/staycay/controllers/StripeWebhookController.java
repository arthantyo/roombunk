package staycay.controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.RefundCreateParams;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import staycay.models.Reservation;
import staycay.models.ReservationPayment;
import staycay.models.enums.PaymentStatus;
import staycay.repositories.ReservationPaymentRepository;
import staycay.services.ReservationService;

@RestController
@RequestMapping("/api/v1/stripe")
@RequiredArgsConstructor
public class StripeWebhookController {
    private final ReservationService reservationService;
    private final ReservationPaymentRepository paymentRepository;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @PostMapping("/webhook")
    @Transactional
    public ResponseEntity<String> handleStripeWebhook(
                                                      @RequestBody String payload, @RequestHeader(value = "Stripe-Signature", required = false) String signatureHeader) {
        if (signatureHeader == null || signatureHeader.isBlank()) {
            return ResponseEntity.badRequest().body("Missing Stripe-Signature header");
        }

        final Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        if (!"checkout.session.completed".equals(event.getType())) {
            return ResponseEntity.ok("Event ignored");
        }

        try {
            Object dataObject = event.getDataObjectDeserializer().getObject().orElse(null);
            if (dataObject == null) {
                dataObject = event.getDataObjectDeserializer().deserializeUnsafe();
            }
            if (!(dataObject instanceof Session session)) {
                return ResponseEntity.badRequest().body("No Checkout Session found");
            }
            return processCompletedSession(session);
        } catch (EventDataObjectDeserializationException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to read Checkout Session");
        }
    }

    private ResponseEntity<String> processCompletedSession(Session session) {
        if (paymentRepository.findByStripeCheckoutSessionId(session.getId()).isPresent()) {
            return ResponseEntity.ok("Checkout Session already processed");
        }

        Map<String, String> metadata = session.getMetadata();
        try {
            Long userId = Long.valueOf(required(metadata, "userId"));
            Long listingId = Long.valueOf(required(metadata, "listingId"));
            LocalDate checkIn = LocalDate.parse(required(metadata, "checkInDate"));
            LocalDate checkOut = LocalDate.parse(required(metadata, "checkOutDate"));
            Integer adults = Integer.valueOf(required(metadata, "adults"));
            Integer children = Integer.valueOf(required(metadata, "children"));
            Integer infants = Integer.valueOf(required(metadata, "infants"));
            Integer pets = Integer.valueOf(required(metadata, "pets"));

            Reservation reservation = reservationService.confirmReservation(
                    userId, listingId, checkIn, checkOut, adults, children, infants, pets, session.getId());

            ReservationPayment payment = new ReservationPayment();
            payment.setReservation(reservation);
            payment.setStripeCheckoutSessionId(session.getId());
            payment.setStripePaymentIntentId(session.getPaymentIntent() == null ? session.getId() : session.getPaymentIntent());
            payment.setAmount(BigDecimal.valueOf(session.getAmountTotal()).movePointLeft(2));
            payment.setCurrency(session.getCurrency() == null ? "eur" : session.getCurrency());
            payment.setStatus(PaymentStatus.SUCCEEDED);
            paymentRepository.save(payment);
            return ResponseEntity.ok("Reservation confirmed: " + reservation.getId());
        } catch (IllegalArgumentException | IllegalStateException ex) {
            refundPayment(session.getPaymentIntent());
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Reservation could not be completed; payment refunded");
        } catch (RuntimeException ex) {
            refundPayment(session.getPaymentIntent());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment processing failed");
        }
    }

    private String required(Map<String, String> metadata, String key) {
        if (metadata == null || metadata.get(key) == null || metadata.get(key).isBlank()) {
            throw new IllegalArgumentException("Missing metadata: " + key);
        }
        return metadata.get(key);
    }

    private void refundPayment(String paymentIntentId) {
        if (paymentIntentId == null || paymentIntentId.isBlank()) {
            return;
        }
        try {
            Refund.create(RefundCreateParams.builder().setPaymentIntent(paymentIntentId).build());
        } catch (StripeException ignored) {
            // Payment succeeded but reservation creation failed; retain the webhook response for Stripe retry/manual review.
        }
    }
}
