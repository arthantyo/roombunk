package staycay.controllers;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;
import staycay.dto.CheckoutSessionResponse;
import staycay.dto.CreateCheckoutSessionRequest;
import staycay.models.Listing;
import staycay.repositories.ListingRepository;
import staycay.security.UserPrincipal;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private static final String CURRENCY = "eur";
    private static final BigDecimal SERVICE_FEE = BigDecimal.valueOf(2);

    private final ListingRepository listingRepository;

    @Value("${stripe.checkout.success-url}")
    private String successUrl;

    @Value("${stripe.checkout.cancel-url}")
    private String cancelUrl;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<CheckoutSessionResponse> createCheckoutSession(
                                                                         @AuthenticationPrincipal UserPrincipal user, @RequestBody CreateCheckoutSessionRequest request) throws StripeException {
        Listing listing = listingRepository.findById(request.listingId()).orElse(null);
        if (listing == null || request.checkInDate() == null || request.checkOutDate() == null || !request.checkOutDate().isAfter(request.checkInDate())) {
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
        if (listing.getMaxGuests() != null && payingGuests > listing.getMaxGuests()) {
            return ResponseEntity.badRequest().build();
        }
        Number configuredGuests = listing.getGuests();
        int includedGuests = configuredGuests == null ? 1 : configuredGuests.intValue();
        int extraGuests = Math.max(0, payingGuests - includedGuests);
        long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());

        Number configuredExtraGuestPrice = listing.getExtraGuestPrice();
        BigDecimal extraGuestPrice = BigDecimal.valueOf(
                configuredExtraGuestPrice == null ? 0D : configuredExtraGuestPrice.doubleValue());
        BigDecimal nightlyPrice = BigDecimal.valueOf(listing.getBasePrice()).add(extraGuestPrice.multiply(BigDecimal.valueOf(extraGuests)));
        BigDecimal total = nightlyPrice.multiply(BigDecimal.valueOf(nights)).add(SERVICE_FEE);
        long amountInCents = total.multiply(BigDecimal.valueOf(100)).setScale(0, RoundingMode.HALF_UP).longValueExact();

        SessionCreateParams params = SessionCreateParams.builder().setMode(SessionCreateParams.Mode.PAYMENT).setSuccessUrl(successUrl).setCancelUrl(cancelUrl + "/" + listing.getId()).addLineItem(SessionCreateParams.LineItem.builder().setQuantity(1L).setPriceData(SessionCreateParams.LineItem.PriceData.builder().setCurrency(CURRENCY).setUnitAmount(amountInCents).setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder().setName(listing.getTitle()).build()).build()).build()).putMetadata("userId", String.valueOf(user.userId())).putMetadata("listingId", String.valueOf(listing.getId())).putMetadata("checkInDate", request.checkInDate().toString()).putMetadata("checkOutDate", request.checkOutDate().toString()).putMetadata("adults", String.valueOf(adults)).putMetadata("children", String.valueOf(children)).putMetadata("infants", String.valueOf(infants)).putMetadata("pets", String.valueOf(pets)).build();

        Session session = Session.create(params);
        return ResponseEntity.ok(new CheckoutSessionResponse(session.getUrl()));
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }
}
