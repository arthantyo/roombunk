package staycay.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import staycay.models.User;

public class UserPrincipal implements UserDetails {
    private final Long userId;
    private final String username;
    private final String password;

    public UserPrincipal(User user) {
        this.userId = user.getId();
        this.username = user.getEmail();
        this.password = user.getPassword();
    }

    public Long userId() {
        return userId;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
}