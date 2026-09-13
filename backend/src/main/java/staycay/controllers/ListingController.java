package staycay.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import staycay.models.Listing;
import staycay.repositories.ListingRepository;
import staycay.repositories.UserRepository;
import staycay.security.UserPrincipal;

@RestController
@RequestMapping("/api/v1/listings")
@RequiredArgsConstructor
public class ListingController {
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Listing> getListings() {
        return listingRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Listing> getListing(@PathVariable Long id) {
        return listingRepository.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Listing> createListing(@RequestBody Listing listing, @AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null) {
            userRepository.findById(principal.userId()).ifPresent(listing::setHost);
        }
        if (listing.getHost() == null) {
            userRepository.findAll().stream().findFirst().ifPresent(listing::setHost);
        }
        return ResponseEntity.ok(listingRepository.save(listing));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Listing> updateListing(@PathVariable Long id, @RequestBody Listing listing) {
        if (!listingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        listing.setId(id);
        return ResponseEntity.ok(listingRepository.save(listing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        if (!listingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        listingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
