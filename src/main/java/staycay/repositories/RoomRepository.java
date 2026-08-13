package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import staycay.models.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
	List<Room> findByHotelId(Long hotelId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Room r WHERE r.id = :roomId")
    Room findRoomByIdForUpdate(@Param("roomId") Long roomId);
}
