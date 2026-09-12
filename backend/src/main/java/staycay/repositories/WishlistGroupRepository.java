package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import staycay.models.WishlistGroup;

public interface WishlistGroupRepository extends JpaRepository<WishlistGroup, Long> {
    List<WishlistGroup> findByUserId(Long userId);

    java.util.Optional<WishlistGroup> findByIdAndUserId(Long id, Long userId);
}
