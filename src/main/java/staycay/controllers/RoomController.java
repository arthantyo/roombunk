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

import staycay.dto.RoomDto;
import staycay.models.Room;
import staycay.services.RoomService;

@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/")
    public ResponseEntity<List<RoomDto>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms().stream().map(RoomDto::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable Long id) {
        Room room = roomService.findRoomById(id);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(RoomDto.from(room));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomDto>> getRoomsByHotelId(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotelId(hotelId).stream().map(RoomDto::from).toList());
    }

    @PostMapping("/")
    public ResponseEntity<RoomDto> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(RoomDto.from(roomService.createNewRoom(room)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDto> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        if (roomService.findRoomById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        room.setId(id);
        return ResponseEntity.ok(RoomDto.from(roomService.updateRoom(room)));
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
