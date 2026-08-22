package staycay.dto;

import java.math.BigDecimal;

import staycay.models.Room;

public record RoomDto(
        Long id,
        String roomType,
        Integer capacity,
        BigDecimal pricePerNight,
        Long hotelId) {

    public static RoomDto from(Room room) {
        return new RoomDto(
                room.getId(),
                room.getRoomType(),
                room.getCapacity(),
                room.getPricePerNight(),
                room.getHotel() != null ? room.getHotel().getId() : null);
    }
}
