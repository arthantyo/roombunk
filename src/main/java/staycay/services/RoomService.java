package staycay.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import staycay.models.Room;
import staycay.repositories.RoomRepository;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    public Room createNewRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public Room findRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    public void deleteRoom(Room room) {
        roomRepository.delete(room);
    }

    public Room updateRoom(Room room) {
        return roomRepository.save(room);
    }
}
