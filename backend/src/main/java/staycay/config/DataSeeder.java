package staycay.config;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;
import staycay.models.Hotel;
import staycay.models.Room;
import staycay.repositories.HotelRepository;
import staycay.repositories.RoomRepository;

// Seeds a demo hotel with a few rooms on startup so the app has data to browse locally.
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    @Bean
    CommandLineRunner seedMockData() {
        return args -> {
            if (hotelRepository.count() > 0) {
                return;
            }

            Hotel hotel = new Hotel();
            hotel.setName("The Grand Staycay");
            hotel.setAddress("123 Ocean Ave");
            hotel.setCity("Miami");
            hotel.setState("FL");
            hotel.setZipCode("33101");
            hotel.setCountry("USA");
            hotelRepository.save(hotel);

            roomRepository.save(newRoom(hotel, "Single", 1, "89.99"));
            roomRepository.save(newRoom(hotel, "Double", 2, "129.99"));
            roomRepository.save(newRoom(hotel, "Suite", 4, "249.99"));
            roomRepository.save(newRoom(hotel, "Deluxe Suite", 6, "349.99"));
        };
    }

    private static Room newRoom(Hotel hotel, String roomType, int capacity, String pricePerNight) {
        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomType(roomType);
        room.setCapacity(capacity);
        room.setPricePerNight(new BigDecimal(pricePerNight));
        return room;
    }
}
