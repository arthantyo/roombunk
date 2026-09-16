package staycay.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import staycay.kafka.events.ReservationConfirmedEvent;
import staycay.models.Listing;
import staycay.models.OutboxEvent;
import staycay.models.Reservation;
import staycay.models.enums.ReservationStatus;
import staycay.repositories.ListingRepository;
import staycay.repositories.OutboxEventRepository;
import staycay.repositories.ReservationRepository;
import staycay.repositories.UserRepository;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class ReservationService {
        private final ReservationRepository reservationRepository;
        private final ListingRepository listingRepository;
        private final UserRepository userRepository;
        private final StringRedisTemplate redisTemplate;
        private final OutboxEventRepository outboxEventRepository;
        private final ObjectMapper objectMapper;

        @Transactional
        public Reservation confirmReservation(
                                              Long userId, Long listingId, LocalDate checkIn, LocalDate checkOut, Integer adults, Integer children, Integer infants, Integer pets, String idempotencyKey
        ) {
                validateDates(checkIn, checkOut);

                String idempotencyRedisKey = "idempotency:" + userId + ":" + idempotencyKey;

                String existingBookingId = redisTemplate.opsForValue().get(idempotencyRedisKey);

                if (existingBookingId != null) {
                        return reservationRepository.findById(Long.valueOf(existingBookingId)).orElseThrow(() -> new IllegalStateException(
                                        "Idempotency record points to missing reservation"
                        ));
                }

                Listing listing = listingRepository.findListingByIdForUpdate(listingId);

                if (listing == null) {
                        throw new IllegalArgumentException(
                                        "Listing not found"
                        );
                }

                List<Reservation> conflicts = reservationRepository.findOverlappingReservations(
                                listingId, checkIn, checkOut
                );

                if (!conflicts.isEmpty()) {
                        throw new IllegalArgumentException(
                                        "The listing is already booked for the selected dates."
                        );
                }

                Reservation reservation = new Reservation();

                reservation.setUser(
                                userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException(
                                                "User not found"
                                ))
                );

                reservation.setListing(listing);
                reservation.setCheckInDate(checkIn);
                reservation.setCheckOutDate(checkOut);
                reservation.setHost(listing.getHost());
                reservation.setAdults(adults);
                reservation.setChildren(children);
                reservation.setInfants(infants);
                reservation.setPets(pets);
                reservation.setStatus(ReservationStatus.PENDING);
                reservation.setConfirmationCode(generateConfirmationCode());

                Reservation saved = reservationRepository.save(reservation);


                /*
                 * Store the result of the idempotent operation in Redis.
                 *
                 * This means retrying the same request can return
                 * the same reservation.
                 */
                redisTemplate.opsForValue().set(
                                idempotencyRedisKey, saved.getId().toString(), java.time.Duration.ofHours(24)
                );

                return reservationRepository.save(reservation);
        }

        public List<Reservation> getAllReservations() {
                return reservationRepository.findAll();
        }

        public List<Reservation> getReservationsByUserId(Long userId) {
                return reservationRepository.findByUserId(userId);
        }

        public List<Reservation> getReservationsByListingId(Long listingId) {
                return reservationRepository.findByListingId(listingId);
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

        @Transactional
        public Reservation acceptReservation(Long reservationId, Long hostId) {
                Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
                if (reservation == null) {
                        throw new IllegalArgumentException("Reservation not found");
                }
                if (reservation.getListing() == null || reservation.getListing().getHost() == null || !reservation.getListing().getHost().getId().equals(hostId)) {
                        throw new SecurityException("Only the listing host can accept this reservation");
                }
                if (reservation.getStatus() != ReservationStatus.PENDING) {
                        throw new IllegalArgumentException("Only pending reservations can be accepted");
                }
                reservation.setStatus(ReservationStatus.CONFIRMED);
                ReservationConfirmedEvent confirmedEvent = new ReservationConfirmedEvent(
                                reservation.getId(), reservation.getListing().getId(), reservation.getUser().getId(), reservation.getUser().getEmail(), reservation.getCheckInDate(), reservation.getCheckOutDate(), reservation.getStatus().name());
                OutboxEvent event = new OutboxEvent();
                event.setTopic("reservations");
                event.setEventType("ReservationConfirmed");
                event.setPayload(objectMapper.writeValueAsString(confirmedEvent));
                event.setPublished(false);
                event.setCreatedAt(LocalDateTime.now());
                outboxEventRepository.save(event);
                return reservationRepository.save(reservation);
        }

        @Transactional
        public Reservation rejectReservation(Long reservationId, Long hostId) {
                Reservation reservation = getReservationForHost(reservationId, hostId);
                if (reservation.getStatus() != ReservationStatus.PENDING) {
                        throw new IllegalArgumentException("Only pending reservations can be rejected");
                }
                reservation.setStatus(ReservationStatus.CANCELLED);
                return reservationRepository.save(reservation);
        }

        @Transactional
        public Reservation cancelReservation(Long reservationId, Long userId) {
                Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
                if (reservation == null) {
                        throw new IllegalArgumentException("Reservation not found");
                }
                if (reservation.getUser() == null || !reservation.getUser().getId().equals(userId)) {
                        throw new SecurityException("Only the guest can cancel this reservation");
                }
                if (reservation.getStatus() == ReservationStatus.CANCELLED) {
                        throw new IllegalArgumentException("Reservation is already cancelled");
                }
                reservation.setStatus(ReservationStatus.CANCELLED);
                return reservationRepository.save(reservation);
        }

        private Reservation getReservationForHost(Long reservationId, Long hostId) {
                Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
                if (reservation == null) {
                        throw new IllegalArgumentException("Reservation not found");
                }
                if (reservation.getListing() == null || reservation.getListing().getHost() == null || !reservation.getListing().getHost().getId().equals(hostId)) {
                        throw new SecurityException("Only the listing host can change this reservation");
                }
                return reservation;
        }

        public List<DateRange> getAvailableDateRanges(Long listingId, LocalDate from, LocalDate to) {
                if (from == null || to == null || !to.isAfter(from)) {
                        throw new IllegalArgumentException("to must be after from");
                }

                List<Reservation> reservations = reservationRepository.findOverlappingReservations(listingId, from, to);
                List<DateRange> available = new ArrayList<>();
                LocalDate nextAvailable = from;

                for (Reservation reservation : reservations.stream().sorted((left, right) -> left.getCheckInDate().compareTo(right.getCheckInDate())).toList()) {
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

        public record DateRange(LocalDate from, LocalDate to) {
        }

        private void validateReservationDates(Reservation reservation) {
                if (reservation.getCheckInDate() != null && reservation.getCheckOutDate() != null && !reservation.getCheckOutDate().isAfter(reservation.getCheckInDate())) {
                        throw new IllegalArgumentException("checkOutDate must be after checkInDate");
                }
        }


        private void validateDates(
                                   LocalDate checkIn, LocalDate checkOut
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


        private String generateConfirmationCode() {
                return UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
        }

}
