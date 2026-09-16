package staycay.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import staycay.models.Reservation;
import staycay.models.enums.ReservationStatus;


@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r JOIN FETCH r.listing WHERE r.user.id = :userId")
    List<Reservation> findByUserId(@Param("userId") Long userId);

    List<Reservation> findByListingId(Long listingId);

    @Query("""
                SELECT r FROM Reservation r
                WHERE r.listing.id = :listingId
                AND r.checkInDate < :checkOutDate
                AND r.checkOutDate > :checkInDate
            """)
    List<Reservation> findOverlappingReservations(
                                                  @Param("listingId") Long listingId, @Param("checkInDate") LocalDate checkInDate, @Param("checkOutDate") LocalDate checkOutDate
    );

    @Query("""
                SELECT r FROM Reservation r
                WHERE r.listing.id = :listingId
                AND r.status = :status
                AND r.checkInDate < :checkOutDate
                AND r.checkOutDate > :checkInDate
            """)
    List<Reservation> findOverlappingReservationsByStatus(
                                                          @Param("listingId") Long listingId, @Param("checkInDate") LocalDate checkInDate, @Param("checkOutDate") LocalDate checkOutDate, @Param("status") ReservationStatus status
    );
}