package staycay.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.StringRedisTemplate;
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
	private static final long HOLD_DURATION_SECONDS = 15 * 60; // 15 minutes

	private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
	private final StringRedisTemplate redisTemplate;

	public String createRoomHold(
            Long userId,
            Long roomId,
			Long hotelId,
            LocalDate checkIn,
            LocalDate checkOut,
            String holdToken
    ) {
        validateDates(checkIn, checkOut);


		List<Reservation> conflicts =
			reservationRepository.findOverlappingReservations(
				roomId,
				checkIn,
				checkOut
			);

		if (!conflicts.isEmpty()) {
			throw new IllegalArgumentException(
				"Room is unavailable for the selected dates."
			);
		}

        String holdKey = buildHoldKey(
				hotelId,
                roomId,
                checkIn,
                checkOut
        );

        String holdValue = userId + ":" + holdToken;

        Boolean acquired = redisTemplate.opsForValue()
                .setIfAbsent(
                        holdKey,
                        holdValue,
                        java.time.Duration.ofSeconds(HOLD_DURATION_SECONDS)
                );

        if (!Boolean.TRUE.equals(acquired)) {
            throw new IllegalArgumentException(
                    "Room is currently being held by another user"
            );
        }

        return holdToken;
    }
  
    @Transactional
	 public Reservation confirmReservation(
            Long userId,
			Long hotelId,
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut,
            String holdToken,
            String idempotencyKey
    ) {
		validateDates(checkIn, checkOut);

		String idempotencyRedisKey =
                "idempotency:" + userId + ":" + idempotencyKey;

        String existingBookingId =
                redisTemplate.opsForValue().get(idempotencyRedisKey);

        if (existingBookingId != null) {
            return reservationRepository
                    .findById(Long.valueOf(existingBookingId))
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "Idempotency record points to missing reservation"
                            ));
        }

        String holdKey = buildHoldKey(
				hotelId,
                roomId,
                checkIn,
                checkOut
        );

        String expectedHoldValue = userId + ":" + holdToken;

        String actualHoldValue =
                redisTemplate.opsForValue().get(holdKey);

        if (actualHoldValue == null) {
            throw new IllegalArgumentException(
                    "Room hold has expired"
            );
        }

        if (!actualHoldValue.equals(expectedHoldValue)) {
            throw new IllegalArgumentException(
                    "Invalid room hold"
            );
        }

        Room room = roomRepository.findRoomByIdForUpdate(roomId);

        if (room == null) {
            throw new IllegalArgumentException(
                    "Room not found"
            );
        }

        List<Reservation> conflicts =
                reservationRepository.findOverlappingReservations(
                        roomId,
                        checkIn,
                        checkOut
                );

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException(
                    "The room is already booked for the selected dates."
            );
        }

		    Reservation reservation = new Reservation();

        reservation.setUser(
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                ))
        );

        reservation.setRoom(room);
        reservation.setCheckInDate(checkIn);
        reservation.setCheckOutDate(checkOut);


		reservation.setStatus(ReservationStatus.PENDING);

        Reservation saved =
                reservationRepository.save(reservation);


		/*
         * Store the result of the idempotent operation in Redis.
         *
         * This means retrying the same request can return
         * the same reservation.
         */
        redisTemplate.opsForValue().set(
                idempotencyRedisKey,
                saved.getId().toString(),
                java.time.Duration.ofHours(24)
        );

		redisTemplate.delete(holdKey);

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


	private void validateDates(
            LocalDate checkIn,
            LocalDate checkOut
    ) {
        if (checkIn == null || checkOut == null) {
            throw new IllegalArgumentException(
                    "Check-in and check-out dates are required"
            );
        }

        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException(
                    "checkOutDate must be after checkInDate"
            );
        }
    }


	private String buildHoldKey(
			Long hotelId,
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut
    ) {
        return "hold:"
				+ hotelId
                + roomId
                + ":"
                + checkIn
                + ":"
                + checkOut;
    }
}
