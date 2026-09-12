package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import staycay.models.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);

    boolean existsByGroupIdAndListingId(Long groupId, Long listingId);

    void deleteByUserIdAndListingId(Long userId, Long listingId);
}
