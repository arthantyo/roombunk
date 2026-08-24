package staycay.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import staycay.kafka.events.ReservationConfirmedEvent;
import staycay.models.OutboxEvent;
import staycay.models.Reservation;
import staycay.models.ReservationStatus;
import staycay.models.Room;
import staycay.repositories.OutboxEventRepository;
import staycay.repositories.ReservationRepository;
import staycay.repositories.RoomRepository;
import staycay.repositories.UserRepository;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ReservationService {
	private static final long HOLD_DURATION_SECONDS = 15 * 60; // 15 minutes

	private final ReservationRepository reservationRepository;
        private final RoomRepository roomRepository;
        private final UserRepository userRepository;
	private final StringRedisTemplate redisTemplate;
	private final OutboxEventRepository outboxEventRepository;
        private final ObjectMapper objectMapper;

	public String createRoomHold(
            Long userId,
            Long hotelId,
            Long roomId,
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

        List<String> holdKeys = buildHoldKeys(
				hotelId,
                roomId,
                checkIn,
                checkOut
        );

        String holdValue = userId + ":" + holdToken;

        List<String> acquiredKeys = new ArrayList<>();

        for (String holdKey : holdKeys) {
            Boolean acquired = redisTemplate.opsForValue()
                    .setIfAbsent(
                            holdKey,
                            holdValue,
                            java.time.Duration.ofSeconds(HOLD_DURATION_SECONDS)
                    );

            if (!Boolean.TRUE.equals(acquired)) {
                // Roll back any keys already grabbed so we don't block
                // unrelated dates on a failed hold attempt.
                if (!acquiredKeys.isEmpty()) {
                    redisTemplate.delete(acquiredKeys);
                }

                throw new IllegalArgumentException(
                        "Room is currently being held by another user"
                );
            }

            acquiredKeys.add(holdKey);
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

        List<String> holdKeys = buildHoldKeys(
				hotelId,
                roomId,
                checkIn,
                checkOut
        );

        String expectedHoldValue = userId + ":" + holdToken;

        boolean holdStillValid = holdKeys.stream().allMatch(key ->
                expectedHoldValue.equals(redisTemplate.opsForValue().get(key)));

        if (!holdStillValid) {
            // The hold may have expired (payment took longer than
            // HOLD_DURATION_SECONDS) or been superseded by another hold.
            // Don't fail here: the row lock + overlap check below against the
            // database is the authoritative source of truth for availability,
            // and the payment has already been captured by this point, so
            // rejecting outright would mean charging a user for nothing.
            System.out.println(
                    "Hold for room " + roomId + " missing/expired at confirm time; "
                            + "falling back to database overlap check."
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
        reservation.setStatus(ReservationStatus.CONFIRMED);

        Reservation saved =
                reservationRepository.save(reservation);


        ReservationConfirmedEvent reservationConfirmedEvent =
                new ReservationConfirmedEvent(
                        saved.getId(),
                        saved.getRoom().getId(),
                        saved.getUser().getId(),
                        saved.getUser().getEmail(),
                        saved.getCheckInDate(),
                        saved.getCheckOutDate(),
                        saved.getStatus().name()
                );

        
        String payload = objectMapper.writeValueAsString(reservationConfirmedEvent);

        OutboxEvent event = new OutboxEvent();
        event.setTopic("reservations");
        event.setEventType("ReservationConfirmed");
        event.setPayload(payload);
        event.setPublished(false);
        event.setCreatedAt(LocalDateTime.now());

        outboxEventRepository.save(event);

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

		redisTemplate.delete(holdKeys);

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


	// One key per night so that partially-overlapping ranges (e.g. 25-27 held by
	// user A, 26-27 requested by user B) correctly contend for the same key(s)
	// instead of silently succeeding because the exact date ranges differ.
	private List<String> buildHoldKeys(
			Long hotelId,
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut
    ) {
        List<String> keys = new ArrayList<>();

        for (LocalDate date = checkIn; date.isBefore(checkOut); date = date.plusDays(1)) {
            keys.add("hold:" + hotelId + ":" + roomId + ":" + date);
        }

        return keys;
    }
}
