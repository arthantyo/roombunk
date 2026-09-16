package staycay.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import staycay.models.enums.ReservationStatus;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(
                name = "reservations", indexes = {
                                // Used when checking whether a listing is already booked
                                @Index(
                                                name = "idx_reservation_listing_dates", columnList = "listing_id, check_in_date, check_out_date"
                                ),

                                // Used when retrieving a user's reservations
                                @Index(
                                                name = "idx_reservation_user_created", columnList = "user_id, created_at"
                                )
                }
)
@Getter
@Setter
@NoArgsConstructor
public class Reservation {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne
        @JoinColumn(name = "host_id", nullable = false)
        private User host;

        @ManyToOne
        @JoinColumn(name = "listing_id", nullable = false)
        private Listing listing;

        @Column(name = "check_in_date", nullable = false)
        private LocalDate checkInDate;

        @Column(name = "check_out_date", nullable = false)
        private LocalDate checkOutDate;

        @Column(name = "adults", nullable = false)
        private Integer adults;

        @Column(name = "children", nullable = false)
        private Integer children;

        @Column(name = "infants", nullable = false)
        private Integer infants;

        @Column(name = "pets", nullable = false)
        private Integer pets;


        @Column(name = "confirmation_code", nullable = false)
        private String confirmationCode;

        @PrePersist
        public void generateConfirmationCode() {
                if (confirmationCode == null) {
                        confirmationCode = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
                }
        }

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        private ReservationStatus status;

        @CreatedDate
        @Column(name = "created_at", nullable = false, updatable = false)
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        private LocalDateTime createdAt;
}