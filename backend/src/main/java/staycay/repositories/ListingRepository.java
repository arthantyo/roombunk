package staycay.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import staycay.models.Listing;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT l FROM Listing l WHERE l.id = :listingId")
    Listing findListingByIdForUpdate(@Param("listingId") Long listingId);
}
