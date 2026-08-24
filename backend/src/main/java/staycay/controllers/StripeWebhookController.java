package staycay.controllers;

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
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.net.Webhook;
import com.stripe.param.RefundCreateParams;

import lombok.RequiredArgsConstructor;
import staycay.models.Reservation;
import staycay.services.ReservationService;

@RestController
@RequestMapping("/api/v1/stripe")
@RequiredArgsConstructor
public class StripeWebhookController {

	private final ReservationService reservationService;

	@Value("${stripe.webhook.secret}")
	private String stripeWebhookSecret;

	@PostMapping("/webhook")
	public ResponseEntity<String> handleStripeWebhook(
			@RequestBody String payload,
			@RequestHeader("Stripe-Signature") String signatureHeader) {

		if (signatureHeader == null || signatureHeader.isEmpty()) {
			return ResponseEntity.badRequest().body("Missing Stripe-Signature header");
		}

		Event event;



		
		try {
			event = Webhook.constructEvent(payload, signatureHeader, stripeWebhookSecret);
		} catch (SignatureVerificationException ex) {
			System.out.println("Webhook signature verification failed.");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
		}

        // only for charges 
		// if ("charge.succeeded".equals(event.getType())) {
		// 	return handleChargeSucceeded(event);
		// } 
        
        if ("payment_intent.succeeded".equals(event.getType())) {
			System.out.println("PaymentIntent succeeded event received.");
			return handlePaymentIntentSucceeded(event);
		}

		return ResponseEntity.ok("Event type not handled: " + event.getType());
	}

	// private ResponseEntity<String> handleChargeSucceeded(Event event) {
	// 	Object dataObject = event.getDataObjectDeserializer().getObject().orElse(null);
	// 	if (dataObject == null) {
	// 		return ResponseEntity.badRequest().body("No data in event");
	// 	}

	// 	com.stripe.model.Charge charge = (com.stripe.model.Charge) dataObject;
	// 	return processReservation(charge.getMetadata());
	// }

	private ResponseEntity<String> handlePaymentIntentSucceeded(Event event) {

            try {
                // event.getId() is the Event's own id (evt_...), not the PaymentIntent id (pi_...) -
                // pull the PaymentIntent straight out of the event payload instead of retrieving by id.
                com.stripe.model.EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
                Object dataObject = deserializer.getObject().orElse(null);
                if (dataObject == null) {
                    dataObject = deserializer.deserializeUnsafe();
                }

                if (dataObject == null) {
					System.out.println(event.getId() + " No PaymentIntent found.");
                    return ResponseEntity.badRequest().body("No data in event");
                }

                PaymentIntent paymentIntent = (PaymentIntent) dataObject;
				Map<String, String> metadata = paymentIntent.getMetadata();
                
                System.out.println(event.getId() + "Received PaymentIntent succeeded event: ");
                
                return processReservation(paymentIntent);
            } catch (EventDataObjectDeserializationException ex) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + ex.getMessage());
            }
	}

	private ResponseEntity<String> processReservation(PaymentIntent paymentIntent) {
		Map<String, String> metadata = paymentIntent.getMetadata();
		try {
			if (metadata == null || metadata.isEmpty()) {
				return ResponseEntity.badRequest().body("No metadata in payment");
			}

			Long userId = Long.valueOf(metadata.getOrDefault("userId", ""));
			Long hotelId = Long.valueOf(metadata.getOrDefault("hotelId", ""));
			Long roomId = Long.valueOf(metadata.getOrDefault("roomId", ""));
			LocalDate checkInDate = LocalDate.parse(metadata.getOrDefault("checkInDate", ""));
			LocalDate checkOutDate = LocalDate.parse(metadata.getOrDefault("checkOutDate", ""));
			String holdToken = metadata.getOrDefault("holdToken", "");
			String idempotencyKey = metadata.getOrDefault("idempotencyKey", "");

			if (holdToken.isEmpty() || idempotencyKey.isEmpty()) {
				return ResponseEntity.badRequest().body("Missing required metadata fields");
			}

			System.out.println("Processing reservation for userId: " + userId + ", hotelId: " + hotelId + ", roomId: " + roomId);

			// Call confirmReservation with the extracted metadata
			Reservation reservation = reservationService.confirmReservation(
					userId,
					hotelId,
					roomId,
					checkInDate,
					checkOutDate,
					holdToken,
					idempotencyKey
			);

			
			return ResponseEntity.ok("Reservation confirmed: " + reservation.getId());

		} catch (IllegalArgumentException ex) {
			// Payment already succeeded but the room couldn't be booked (e.g. lost
			// the race to another confirmed reservation, or the hold was taken
			// over and the room is now genuinely unavailable) - refund the charge
			// so the customer isn't billed for a reservation that doesn't exist.
			System.out.println("Invalid metadata: " + ex.getMessage());
			refundPayment(paymentIntent.getId(), ex.getMessage());
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Reservation could not be completed, payment refunded: " + ex.getMessage());
		} catch (IllegalStateException ex) {
			System.out.println("State error: " + ex.getMessage());
			refundPayment(paymentIntent.getId(), ex.getMessage());
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Reservation state error: " + ex.getMessage());
		} catch (RuntimeException ex) {
			System.out.println("Unexpected error: " + ex.getMessage());
			refundPayment(paymentIntent.getId(), ex.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing payment: " + ex.getMessage());
		}
	}

	private void refundPayment(String paymentIntentId, String reason) {
		try {
			Refund.create(RefundCreateParams.builder()
					.setPaymentIntent(paymentIntentId)
					.build());
			System.out.println("Refunded payment intent " + paymentIntentId + " (" + reason + ")");
		} catch (StripeException ex) {
			// Refund failed - needs manual follow-up, but must not block the webhook response.
			System.out.println("Failed to refund payment intent " + paymentIntentId + ": " + ex.getMessage());
		}
	}
}
