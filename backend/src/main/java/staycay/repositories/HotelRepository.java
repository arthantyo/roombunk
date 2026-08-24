package staycay.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import staycay.models.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
}
