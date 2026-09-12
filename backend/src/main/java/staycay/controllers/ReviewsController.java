package staycay.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import staycay.models.Listing;
import staycay.models.Reviews;
import staycay.repositories.ListingRepository;
import staycay.repositories.ReviewsRepository;
import staycay.repositories.UserRepository;
import staycay.security.UserPrincipal;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewsController {
    private final ReviewsRepository reviewsRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    @GetMapping("/listing/{listingId}")
    public List<Reviews> getListingReviews(@PathVariable Long listingId) {
        return reviewsRepository.findByListingId(listingId);
    }

    @PostMapping
    public ResponseEntity<Reviews> createReview(
                                                @AuthenticationPrincipal UserPrincipal principal, @RequestBody ReviewRequest request) {
        var user = userRepository.findById(principal.userId()).orElse(null);
        Listing listing = listingRepository.findById(request.listingId()).orElse(null);
        if (user == null || listing == null) {
            return ResponseEntity.notFound().build();
        }
        Reviews review = new Reviews();
        review.setUser(user);
        review.setListing(listing);
        review.setContent(request.content());
        review.setOverallRating(request.overallRating());
        review.setCleanliness(request.cleanliness());
        review.setAccuracy(request.accuracy());
        review.setCheckIn(request.checkIn());
        review.setCommunication(request.communication());
        review.setLocation(request.location());
        review.setValueForMoney(request.valueForMoney());
        return ResponseEntity.ok(reviewsRepository.save(review));
    }

    public record ReviewRequest(Long listingId, String content, Integer overallRating,
                                Integer cleanliness, Integer accuracy, Integer checkIn, Integer communication,
                                Integer location, Integer valueForMoney) {
    }
}
