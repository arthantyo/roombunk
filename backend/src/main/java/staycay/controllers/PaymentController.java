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
                                                                     @AuthenticationPrincipal UserPrincipal user, @RequestBody CreatePaymentIntentRequest request) throws StripeException {

        Listing listing = listingRepository.findById(request.listingId()).orElse(null);
        if (listing == null) {
            return ResponseEntity.notFound().build();
        }

        int adults = request.adults() == null ? 0 : request.adults();
        int children = request.children() == null ? 0 : request.children();
        int infants = request.infants() == null ? 0 : request.infants();
        int pets = request.pets() == null ? 0 : request.pets();
        int payingGuests = adults + children;
        int includedGuests = listing.getGuests() == null ? 1 : listing.getGuests();
        long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
        if (nights <= 0 || adults < 1 || children < 0 || infants < 0 || pets < 0 || (listing.getMaxGuests() != null && payingGuests > listing.getMaxGuests()) || (pets > 0 && !Boolean.TRUE.equals(listing.getPetFriendly()))) {
            return ResponseEntity.badRequest().build();
        }

        int extraGuests = Math.max(0, payingGuests - includedGuests);
        BigDecimal nightlyPrice = BigDecimal.valueOf(listing.getBasePrice()).add(BigDecimal.valueOf(listing.getExtraGuestPrice() == null ? 0 : listing.getExtraGuestPrice()).multiply(BigDecimal.valueOf(extraGuests)));
        BigDecimal total = nightlyPrice.multiply(BigDecimal.valueOf(nights));
        long amountInCents = total.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).longValueExact();
        String idempotencyKey = UUID.randomUUID().toString();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder().setAmount(amountInCents).setCurrency(CURRENCY).putMetadata("userId", String.valueOf(user.userId())).putMetadata("listingId", String.valueOf(request.listingId())).putMetadata("checkInDate", request.checkInDate().toString()).putMetadata("checkOutDate", request.checkOutDate().toString()).putMetadata("adults", String.valueOf(adults)).putMetadata("children", String.valueOf(children)).putMetadata("infants", String.valueOf(infants)).putMetadata("pets", String.valueOf(pets)).putMetadata("idempotencyKey", idempotencyKey).setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()).build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return ResponseEntity.ok(new PaymentIntentResponse(
                paymentIntent.getClientSecret(), idempotencyKey, amountInCents, CURRENCY));
    }
}
