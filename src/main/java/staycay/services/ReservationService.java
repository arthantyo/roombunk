package staycay.services;

import java.util.List;
import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import staycay.models.Reservation;
import staycay.models.ReservationStatus;
import staycay.models.Room;
import staycay.repositories.ReservationRepository;
import staycay.repositories.RoomRepository;
import staycay.repositories.UserRepository;

@Service
@RequiredArgsConstructor
public class ReservationService {
	private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    // TODO: payment must be done 1 day after the reservation is created, otherwise the reservation will be canceled automatically.
    
    // TODO: prevent double booking of the same room

    // TODO: mail creation of reservation
    @Transactional
	public Reservation createNewReservation(Long userId, String idempotencyKey, Reservation reservation) {

		Reservation existing = reservationRepository.findByIdempotencyKey(idempotencyKey).orElse(null);

		if (existing != null) {
			if (!existing.getUser().getId().equals(userId)
					|| !existing.getRoom().getId().equals(reservation.getRoom().getId())
					|| !existing.getCheckInDate().equals(reservation.getCheckInDate())
					|| !existing.getCheckOutDate().equals(reservation.getCheckOutDate())) {
				throw new IllegalArgumentException("Idempotency key was already used for another reservation");
			}
			return existing;
		}

		reservation.setUser(userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found")));
		reservation.setIdempotencyKey(idempotencyKey);

        validateReservationDates(reservation);

        // lock
        Long roomId = reservation.getRoom().getId();

        Room room = roomRepository.findRoomByIdForUpdate(roomId);

        if (room == null) {
            throw new IllegalArgumentException("Room not found");
        }

        List<Reservation> conflicts =
                reservationRepository.findOverlappingReservations(
                        reservation.getRoom().getId(),
                        reservation.getCheckInDate(),
                        reservation.getCheckOutDate()
                );

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException(
                    "The room is already booked for the selected dates."
            );
        }

		// Reservation status is server-managed and not accepted from request body.
		reservation.setStatus(ReservationStatus.PENDING);

        return reservationRepository.save(reservation);
    }

	public List<Reservation> getAllReservations() {
		return reservationRepository.findAll();
	}

	public List<Reservation> getReservationsByUserId(Long userId) {
		return reservationRepository.findByUserId(userId);
	}

	public List<Reservation> getReservationsByRoomId(Long roomId) {
		return reservationRepository.findByRoomId(roomId);
	}

	public Reservation findReservationById(Long id) {
		return reservationRepository.findById(id).orElse(null);
	}

	public void deleteReservation(Reservation reservation) {
		reservationRepository.delete(reservation);
	}

	public Reservation updateReservation(Reservation reservation) {
		validateReservationDates(reservation);
		Reservation existingReservation = reservationRepository.findById(reservation.getId()).orElse(null);

		if (existingReservation == null) {
			throw new IllegalArgumentException("Reservation not found");
		}

		// Preserve server-managed status on generic update.
		reservation.setStatus(existingReservation.getStatus());
		return reservationRepository.save(reservation);
	}

	public List<DateRange> getAvailableDateRanges(Long roomId, LocalDate from, LocalDate to) {
		if (from == null || to == null || !to.isAfter(from)) {
			throw new IllegalArgumentException("to must be after from");
		}

		List<Reservation> reservations = reservationRepository.findOverlappingReservations(roomId, from, to);
		List<DateRange> available = new ArrayList<>();
		LocalDate nextAvailable = from;

		for (Reservation reservation : reservations.stream()
				.sorted((left, right) -> left.getCheckInDate().compareTo(right.getCheckInDate()))
				.toList()) {
			if (nextAvailable.isBefore(reservation.getCheckInDate())) {
				available.add(new DateRange(nextAvailable, reservation.getCheckInDate()));
			}
			if (nextAvailable.isBefore(reservation.getCheckOutDate())) {
				nextAvailable = reservation.getCheckOutDate();
			}
		}

		if (nextAvailable.isBefore(to)) {
			available.add(new DateRange(nextAvailable, to));
		}
		return available;
	}

	public record DateRange(LocalDate from, LocalDate to) {}

	private void validateReservationDates(Reservation reservation) {
		if (reservation.getCheckInDate() != null
				&& reservation.getCheckOutDate() != null
				&& !reservation.getCheckOutDate().isAfter(reservation.getCheckInDate())) {
			throw new IllegalArgumentException("checkOutDate must be after checkInDate");
		}
	}
}
