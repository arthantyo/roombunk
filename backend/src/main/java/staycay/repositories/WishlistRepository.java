package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import staycay.models.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);

    boolean existsByGroupIdAndListingId(Long groupId, Long listingId);

    void deleteByUserIdAndListingId(Long userId, Long listingId);

    @Query("select distinct w.listing.id from Wishlist w where w.user.id = :userId")
    List<Long> findListingIdsByUserId(Long userId);
}
