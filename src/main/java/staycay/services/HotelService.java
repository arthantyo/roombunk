package staycay.services;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import staycay.models.Hotel;
import staycay.repositories.HotelRepository;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final HotelRepository hotelRepository;

    public Hotel createNewHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Page<Hotel> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable);
    }

    public Hotel findHotelById(Long id) {
        return hotelRepository.findById(id).orElse(null);
    }

    public void deleteHotel(Hotel hotel) {
        hotelRepository.delete(hotel);
    }

    public Hotel updateHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

}
