package staycay.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import staycay.models.Reservation;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByIdempotencyKey(String idempotencyKey);
	List<Reservation> findByUserId(Long userId);

	List<Reservation> findByRoomId(Long roomId);

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.room.id = :roomId
        AND r.checkInDate < :checkOutDate
        AND r.checkOutDate > :checkInDate
    """)
    List<Reservation> findOverlappingReservations(
        @Param("roomId") Long roomId,
        @Param("checkInDate") LocalDate checkInDate,
        @Param("checkOutDate") LocalDate checkOutDate
    );
}