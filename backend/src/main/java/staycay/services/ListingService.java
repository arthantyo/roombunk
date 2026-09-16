package staycay.services;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import staycay.models.Listing;
import staycay.models.enums.ListingStatus;
import staycay.models.enums.ReservationStatus;
import staycay.repositories.ListingRepository;
import staycay.repositories.ReservationRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final ReservationRepository reservationRepository;

    @Transactional
    public void archiveListing(Long id) {
        Listing listing = listingRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Listing not found"));

        boolean hasActiveReservations = reservationRepository.existsByListingIdAndStatusNotIn(
                id, List.of(
                        ReservationStatus.FINISHED, ReservationStatus.CANCELLED
                )
        );

        if (hasActiveReservations) {
            throw new IllegalStateException(
                    "Listing cannot be deleted while it has active reservations"
            );
        }

        listing.setStatus(ListingStatus.ARCHIVED);
    }
}