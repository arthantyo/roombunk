package staycay.controllers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import lombok.RequiredArgsConstructor;
import staycay.dto.CreatePaymentIntentRequest;
import staycay.dto.PaymentIntentResponse;
import staycay.models.Room;
import staycay.security.UserPrincipal;
import staycay.services.RoomService;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private static final String CURRENCY = "usd";

    private final RoomService roomService;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody CreatePaymentIntentRequest request) throws StripeException {

        Room room = roomService.findRoomById(request.roomId());
        if (room == null) {
            return ResponseEntity.notFound().build();
        }

        long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
        if (nights <= 0) {
            return ResponseEntity.badRequest().build();
        }

        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
        long amountInCents = total.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).longValueExact();
        String idempotencyKey = UUID.randomUUID().toString();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(CURRENCY)
                .putMetadata("userId", String.valueOf(user.userId()))
                .putMetadata("hotelId", String.valueOf(request.hotelId()))
                .putMetadata("roomId", String.valueOf(request.roomId()))
                .putMetadata("checkInDate", request.checkInDate().toString())
                .putMetadata("checkOutDate", request.checkOutDate().toString())
                .putMetadata("holdToken", request.holdToken())
                .putMetadata("idempotencyKey", idempotencyKey)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return ResponseEntity.ok(new PaymentIntentResponse(
                paymentIntent.getClientSecret(), idempotencyKey, amountInCents, CURRENCY));
    }
}
