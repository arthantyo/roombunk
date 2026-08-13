package staycay.services;

import java.util.List;

import org.springframework.stereotype.Service;

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

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
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
