
package staycay.models;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import staycay.models.enums.AmenityType;
import staycay.models.enums.GuestAccessType;
import staycay.models.enums.ListingStatus;
import staycay.models.enums.PropertyType;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
public class Listing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "property_type")
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Column(name = "guest_access")
    @Enumerated(EnumType.STRING)
    private GuestAccessType guestAccess;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "country")
    private String country;

    @Column(name = "province")
    private String province;

    @Column(name = "guests")
    private Integer guests;

    @Column(name = "beds")
    private Integer beds;

    @Column(name = "bathrooms")
    private Integer bathrooms;

    @Column(name = "bedrooms")
    private Integer bedrooms;

    @Column(name = "pet_friendly")
    private Boolean petFriendly;

    @ElementCollection
    @CollectionTable(
            name = "listing_amenities", joinColumns = @JoinColumn(name = "listing_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "amenity")
    private Set<AmenityType> amenities;

    @Column(name = "base_price")
    private Double basePrice;

    @Column(name = "extra_guest_price")
    private Double extraGuestPrice;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ListingStatus status;

    @Column(name = "verified")
    private Boolean verified;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

}
