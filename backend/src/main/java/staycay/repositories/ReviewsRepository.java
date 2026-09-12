package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import staycay.models.Reviews;

public interface ReviewsRepository extends JpaRepository<Reviews, Long> {
    List<Reviews> findByListingId(Long listingId);
}
