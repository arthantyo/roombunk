package staycay.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import staycay.models.Reservation;
import staycay.services.ReservationService;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Reservation reservation = reservationService.findReservationById(id);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reservation);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUserId(userId));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Reservation>> getReservationsByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(reservationService.getReservationsByRoomId(roomId));
    }

    @PostMapping("/")
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {

        

        return ResponseEntity.ok(reservationService.createNewReservation(reservation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) {
        if (reservationService.findReservationById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        reservation.setId(id);
        return ResponseEntity.ok(reservationService.updateReservation(reservation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteReservation(@PathVariable Long id) {
        Reservation reservation = reservationService.findReservationById(id);
        if (reservation == null) {
            return ResponseEntity.notFound().build();
        }
        reservationService.deleteReservation(reservation);
        return ResponseEntity.ok(true);
    }
}
