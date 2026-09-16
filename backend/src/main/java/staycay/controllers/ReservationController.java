package staycay.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import staycay.dto.ReservationDto;
import staycay.models.Reservation;
import staycay.security.UserPrincipal;
import staycay.services.ReservationService;


// User
// ↓
// React checkout
// ↓
// Stripe payment
// ↓
// Stripe redirects user back to StayCay
// ↓
// React shows "Payment received, confirming reservation..."

// Meanwhile:

// Stripe
// ↓
// Webhook → StayCay backend
// ↓
// Verify webhook signature
// ↓
// Verify payment details
// ↓
// reservationService.confirmReservation()
// ↓
// Short PostgreSQL transaction
// ↓
// Create reservation
// ↓
// COMMIT
// ↓
// Send confirmation email

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/")
    public ResponseEntity<List<ReservationDto>> getAllReservations(
                                                                   @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(toResponses(reservationService.getReservationsByUserId(user.userId())));
    }

    @GetMapping("/host")
    public ResponseEntity<List<ReservationDto>> getHostReservations(
                                                                    @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(toResponses(reservationService.getReservationsByHostId(user.userId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDto> getReservationById(
                                                             @PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        Reservation reservation = reservationService.findReservationById(id);
        if (reservation == null || !reservation.getUser().getId().equals(user.userId())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ReservationDto.from(reservation));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDto>> getReservationsByUserId(
                                                                        @PathVariable Long userId, @AuthenticationPrincipal UserPrincipal user) {
        if (!userId.equals(user.userId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(toResponses(reservationService.getReservationsByUserId(userId)));
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<ReservationDto>> getReservationsByListingId(@PathVariable Long listingId) {
        return ResponseEntity.ok(toResponses(reservationService.getReservationsByListingId(listingId)));
    }

    @GetMapping("/listing/{listingId}/availability")
    public ResponseEntity<List<ReservationService.DateRange>> getListingAvailability(
                                                                                     @PathVariable Long listingId, @RequestParam LocalDate from, @RequestParam LocalDate to) {
        return ResponseEntity.ok(reservationService.getAvailableDateRanges(listingId, from, to));
    }


    @PatchMapping("/{id}/accept")
    public ResponseEntity<ReservationDto> acceptReservation(
                                                            @PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ReservationDto.from(
                reservationService.acceptReservation(id, user.userId())));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ReservationDto> rejectReservation(
                                                            @PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ReservationDto.from(
                reservationService.rejectReservation(id, user.userId())));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReservationDto> cancelReservation(
                                                            @PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ReservationDto.from(
                reservationService.cancelReservation(id, user.userId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationDto> updateReservation(
                                                            @PathVariable Long id, @AuthenticationPrincipal UserPrincipal user, @RequestBody Reservation reservation) {
        Reservation existing = reservationService.findReservationById(id);
        if (existing == null || !existing.getUser().getId().equals(user.userId())) {
            return ResponseEntity.notFound().build();
        }
        reservation.setId(id);
        return ResponseEntity.ok(ReservationDto.from(reservationService.updateReservation(reservation)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteReservation(
                                                     @PathVariable Long id, @AuthenticationPrincipal UserPrincipal user) {
        Reservation reservation = reservationService.findReservationById(id);
        if (reservation == null || !reservation.getUser().getId().equals(user.userId())) {
            return ResponseEntity.notFound().build();
        }
        reservationService.deleteReservation(reservation);
        return ResponseEntity.ok(true);
    }

    private List<ReservationDto> toResponses(List<Reservation> reservations) {
        return reservations.stream().map(ReservationDto::from).toList();
    }


}

