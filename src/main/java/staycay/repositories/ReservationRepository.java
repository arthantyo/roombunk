package staycay.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import staycay.models.Reservation;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	List<Reservation> findByUserId(Long userId);

	List<Reservation> findByRoomId(Long roomId);

    @Query("""
        SELECT * FROM Reservation r 
        WHERE r.room.hotel.id = :hotelId
        AND r.checkInDate < :checkOutDate
        AND r.checkOutDate > :checkInDate
    """)
    List<Reservation> findOverlappingReservations(
        @Param("roomId") Long roomId,
        @Param("checkInDate") LocalDate checkInDate,
        @Param("checkOutDate") LocalDate checkOutDate
    );
}