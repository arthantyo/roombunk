package staycay.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import staycay.dto.HotelDto;
import staycay.models.Hotel;
import staycay.services.HotelService;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping("/")
    public ResponseEntity<Page<HotelDto>> getAllHotels(Pageable pageable) {
        return ResponseEntity.ok(hotelService.getAllHotels(pageable).map(HotelDto::from));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDto> getHotelById(@PathVariable Long id) {
        Hotel hotel = hotelService.findHotelById(id);
        if (hotel == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(HotelDto.from(hotel));
    }

    @PostMapping("/")
    public ResponseEntity<HotelDto> createHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(HotelDto.from(hotelService.createNewHotel(hotel)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelDto> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        if (hotelService.findHotelById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        hotel.setId(id);
        return ResponseEntity.ok(HotelDto.from(hotelService.updateHotel(hotel)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteHotel(@PathVariable Long id) {
        Hotel hotel = hotelService.findHotelById(id);
        if (hotel == null) {
            return ResponseEntity.notFound().build();
        }
        hotelService.deleteHotel(hotel);
        return ResponseEntity.ok(true);
    }
}
