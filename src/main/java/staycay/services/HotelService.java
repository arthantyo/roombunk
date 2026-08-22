package staycay.services;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import staycay.models.Hotel;
import staycay.repositories.HotelRepository;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final HotelRepository hotelRepository;

    @CacheEvict(value = { "hotels", "hotelById" }, allEntries = true)
    public Hotel createNewHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Cacheable(value = "hotels", key = "#pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()")
    public Page<Hotel> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable);
    }

    @Cacheable(value = "hotelById", key = "#id")
    public Hotel findHotelById(Long id) {
        return hotelRepository.findById(id).orElse(null);
    }

    @CacheEvict(value = { "hotels", "hotelById" }, allEntries = true)
    public void deleteHotel(Hotel hotel) {
        hotelRepository.delete(hotel);
    }

    @CacheEvict(value = { "hotels", "hotelById" }, allEntries = true)
    public Hotel updateHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

}
