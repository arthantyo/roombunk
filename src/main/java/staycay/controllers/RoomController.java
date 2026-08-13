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

import staycay.models.Room;
import staycay.services.RoomService;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Room room = roomService.findRoomById(id);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotelId(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotelId(hotelId));
    }

    @PostMapping("/")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.createNewRoom(room));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        if (roomService.findRoomById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        room.setId(id);
        return ResponseEntity.ok(roomService.updateRoom(room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteRoom(@PathVariable Long id) {
        Room room = roomService.findRoomById(id);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        roomService.deleteRoom(room);
        return ResponseEntity.ok(true);
    }
}
