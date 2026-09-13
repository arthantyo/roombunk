package staycay.controllers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.net.RequestOptions;
import com.stripe.param.PaymentIntentCreateParams;

import lombok.RequiredArgsConstructor;
import staycay.dto.CreatePaymentIntentRequest;
import staycay.dto.PaymentIntentResponse;
import staycay.models.Listing;
import staycay.repositories.ListingRepository;
import staycay.security.UserPrincipal;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private static final String CURRENCY = "eur";

    private final ListingRepository listingRepository;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
                                                                     @AuthenticationPrincipal UserPrincipal user, @RequestBody CreatePaymentIntentRequest request
    ) throws StripeException {

        Listing listing = listingRepository.findById(request.listingId()).orElse(null);

        if (listing == null) {
            return ResponseEntity.notFound().build();
        }

        long nights = ChronoUnit.DAYS.between(
                request.checkInDate(), request.checkOutDate()
        );

        if (nights <= 0) {
            return ResponseEntity.badRequest().build();
        }

        int adults = valueOrZero(request.adults());
        int children = valueOrZero(request.children());
        int infants = valueOrZero(request.infants());
        int pets = valueOrZero(request.pets());

        if (adults <= 0) {
            return ResponseEntity.badRequest().build();
        }

        int payingGuests = adults + children;

        int includedGuests = listing.getGuests() == null ? 1 : listing.getGuests();

        int extraGuests = Math.max(0, payingGuests - includedGuests);

        BigDecimal basePrice = BigDecimal.valueOf(listing.getBasePrice());

        BigDecimal extraGuestPrice = BigDecimal.valueOf(
                listing.getExtraGuestPrice() == null ? 0 : listing.getExtraGuestPrice()
        );

        BigDecimal nightlyPrice = basePrice.add(
                extraGuestPrice.multiply(BigDecimal.valueOf(extraGuests))
        );

        BigDecimal total = nightlyPrice.multiply(
                BigDecimal.valueOf(nights)
        );

        long amountInCents = total.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).longValueExact();

        String idempotencyKey = buildIdempotencyKey(user, request);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder().setAmount(amountInCents).setCurrency(CURRENCY).setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
        ).putMetadata(
                "userId", String.valueOf(user.userId())
        ).putMetadata(
                "listingId", String.valueOf(request.listingId())
        ).putMetadata(
                "checkInDate", request.checkInDate().toString()
        ).putMetadata(
                "checkOutDate", request.checkOutDate().toString()
        ).putMetadata(
                "adults", String.valueOf(adults)
        ).putMetadata(
                "children", String.valueOf(children)
        ).putMetadata(
                "infants", String.valueOf(infants)
        ).putMetadata(
                "pets", String.valueOf(pets)
        ).build();

        RequestOptions options = RequestOptions.builder().setIdempotencyKey(idempotencyKey).build();

        PaymentIntent paymentIntent = PaymentIntent.create(params, options);

        return ResponseEntity.ok(
                new PaymentIntentResponse(
                        paymentIntent.getClientSecret(), idempotencyKey, amountInCents, CURRENCY
                )
        );
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }

    private String buildIdempotencyKey(
                                       UserPrincipal user, CreatePaymentIntentRequest request
    ) {
        return "payment:" + user.userId() + ":" + request.listingId() + ":" + request.checkInDate() + ":" + request.checkOutDate();
    }
}