package staycay.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
public class Reviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @Column(nullable = false)
    private String content;

    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;

    @Column(name = "cleanliness", nullable = false)
    private Integer cleanliness;

    @Column(name = "accuracy", nullable = false)
    private Integer accuracy;

    @Column(name = "check_in", nullable = false)
    private Integer checkIn;

    @Column(name = "communication", nullable = false)
    private Integer communication;

    @Column(name = "location", nullable = false)
    private Integer location;

    @Column(name = "value_for_money", nullable = false)
    private Integer valueForMoney;
}
