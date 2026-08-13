package staycay.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import staycay.models.Reservation;
import staycay.models.Room;
import staycay.repositories.ReservationRepository;
import staycay.repositories.RoomRepository;

import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationService {
	private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    @Transactional
    public Reservation createNewReservation(Reservation reservation) {

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
		return reservationRepository.save(reservation);
	}

	private void validateReservationDates(Reservation reservation) {
		if (reservation.getCheckInDate() != null
				&& reservation.getCheckOutDate() != null
				&& !reservation.getCheckOutDate().isAfter(reservation.getCheckInDate())) {
			throw new IllegalArgumentException("checkOutDate must be after checkInDate");
		}
	}
}
