package staycay.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import staycay.models.Listing;
import staycay.models.User;
import staycay.models.Wishlist;
import staycay.models.WishlistGroup;
import staycay.repositories.ListingRepository;
import staycay.repositories.UserRepository;
import staycay.repositories.WishlistGroupRepository;
import staycay.repositories.WishlistRepository;
import staycay.security.UserPrincipal;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistRepository wishlistRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final WishlistGroupRepository wishlistGroupRepository;

    @GetMapping
    public List<Wishlist> getMyWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        return wishlistRepository.findByUserId(principal.userId());
    }

    @GetMapping("/groups")
    public List<WishlistGroup> getMyGroups(@AuthenticationPrincipal UserPrincipal principal) {
        return wishlistGroupRepository.findByUserId(principal.userId());
    }

    @PostMapping("/groups")
    public ResponseEntity<WishlistGroup> createGroup(
                                                     @AuthenticationPrincipal UserPrincipal principal, @RequestBody GroupRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        User user = userRepository.findById(principal.userId()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        WishlistGroup group = new WishlistGroup();
        group.setUser(user);
        group.setName(request.name().trim());
        return ResponseEntity.ok(wishlistGroupRepository.save(group));
    }

    @PostMapping
    public ResponseEntity<Wishlist> addToWishlist(
                                                  @AuthenticationPrincipal UserPrincipal principal, @RequestBody ListingRequest request) {
        if (request.groupId() == null) {
            return ResponseEntity.badRequest().build();
        }
        if (wishlistRepository.existsByGroupIdAndListingId(request.groupId(), request.listingId())) {
            return ResponseEntity.badRequest().build();
        }
        User user = userRepository.findById(principal.userId()).orElse(null);
        Listing listing = listingRepository.findById(request.listingId()).orElse(null);
        WishlistGroup group = wishlistGroupRepository.findByIdAndUserId(request.groupId(), principal.userId()).orElse(null);
        if (user == null || listing == null || group == null) {
            return ResponseEntity.notFound().build();
        }
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setListing(listing);
        wishlist.setGroup(group);
        return ResponseEntity.ok(wishlistRepository.save(wishlist));
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<Void> removeFromWishlist(
                                                   @AuthenticationPrincipal UserPrincipal principal, @PathVariable Long listingId) {
        wishlistRepository.deleteByUserIdAndListingId(principal.userId(), listingId);
        return ResponseEntity.noContent().build();
    }

    public record ListingRequest(Long listingId, Long groupId) {
    }

    public record GroupRequest(String name) {
    }
}
