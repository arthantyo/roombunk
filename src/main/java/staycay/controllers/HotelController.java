package staycay.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import staycay.models.Hotel;
import staycay.services.HotelService;

@RestController
@RequestMapping("/api/v1/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @GetMapping("/")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        Hotel hotel = hotelService.findHotelById(id);
        if (hotel == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(hotel);
    }

    @PostMapping("/")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.createNewHotel(hotel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        if (hotelService.findHotelById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        hotel.setId(id);
        return ResponseEntity.ok(hotelService.updateHotel(hotel));
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
