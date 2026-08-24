package staycay.services;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import staycay.models.Room;
import staycay.repositories.RoomRepository;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;

    @CacheEvict(value = { "roomsAll", "roomsByHotelId", "roomById" }, allEntries = true)
    public Room createNewRoom(Room room) {
        return roomRepository.save(room);
    }

    @Cacheable("roomsAll")
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Cacheable(value = "roomsByHotelId", key = "#hotelId")
    public List<Room> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    @Cacheable(value = "roomById", key = "#id")
    public Room findRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    @CacheEvict(value = { "roomsAll", "roomsByHotelId", "roomById" }, allEntries = true)
    public void deleteRoom(Room room) {
        roomRepository.delete(room);
    }

    @CacheEvict(value = { "roomsAll", "roomsByHotelId", "roomById" }, allEntries = true)
    public Room updateRoom(Room room) {
        return roomRepository.save(room);
    }
}
