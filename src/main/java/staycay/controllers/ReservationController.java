package staycay.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import staycay.dto.ReservationResponse;
import staycay.models.Reservation;
import staycay.security.UserPrincipal;
import staycay.services.ReservationService;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/")
    public ResponseEntity<List<ReservationResponse>> getAllReservations(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(toResponses(reservationService.getReservationsByUserId(user.userId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        Reservation reservation = reservationService.findReservationById(id);
        if (reservation == null || !reservation.getUser().getId().equals(user.userId())) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ReservationResponse.from(reservation));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByUserId(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal user) {
        if (!userId.equals(user.userId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(toResponses(reservationService.getReservationsByUserId(userId)));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(toResponses(reservationService.getReservationsByRoomId(roomId)));
    }

    @GetMapping("/room/{roomId}/availability")
    public ResponseEntity<List<ReservationService.DateRange>> getRoomAvailability(
            @PathVariable Long roomId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to) {
        return ResponseEntity.ok(reservationService.getAvailableDateRanges(roomId, from, to));
    }

    @PostMapping("/")
        public ResponseEntity<ReservationResponse> createReservation(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestHeader("Idempotency-Key") UUID idempotencyKey,
            @RequestBody Reservation reservation) {
        Reservation createdReservation = reservationService.createNewReservation(
            user.userId(), idempotencyKey.toString(), reservation);
        return ResponseEntity.ok(ReservationResponse.from(createdReservation));
    }

    @PutMapping("/{id}")
        public ResponseEntity<ReservationResponse> updateReservation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody Reservation reservation) {
        Reservation existing = reservationService.findReservationById(id);
        if (existing == null || !existing.getUser().getId().equals(user.userId())) {
            return ResponseEntity.notFound().build();
        }
        reservation.setId(id);
        return ResponseEntity.ok(ReservationResponse.from(reservationService.updateReservation(reservation)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteReservation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal user) {
        Reservation reservation = reservationService.findReservationById(id);
        if (reservation == null || !reservation.getUser().getId().equals(user.userId())) {
            return ResponseEntity.notFound().build();
        }
        reservationService.deleteReservation(reservation);
        return ResponseEntity.ok(true);
    }

    private List<ReservationResponse> toResponses(List<Reservation> reservations) {
        return reservations.stream()
                .map(ReservationResponse::from)
                .toList();
    }
}
