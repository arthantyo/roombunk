package staycay.dto;

import staycay.models.User;

public record UserDto(Long id, String username, String email) {

    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }
}
