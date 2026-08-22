package staycay.dto;

import staycay.models.Hotel;

public record HotelDto(
        Long id,
        String name,
        String address,
        String city,
        String state,
        String zipCode,
        String country) {

    public static HotelDto from(Hotel hotel) {
        return new HotelDto(
                hotel.getId(),
                hotel.getName(),
                hotel.getAddress(),
                hotel.getCity(),
                hotel.getState(),
                hotel.getZipCode(),
                hotel.getCountry());
    }
}
