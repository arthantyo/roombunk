package staycay.models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import staycay.models.enums.PaymentStatus;

@Entity
@Table(
                name = "reservation_payments", uniqueConstraints = @UniqueConstraint(
                                name = "uk_payment_stripe_intent", columnNames = "stripe_payment_intent_id"
                )
)
@Getter
@Setter
@NoArgsConstructor
public class ReservationPayment {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "reservation_id", nullable = false)
        private Reservation reservation;

        @Column(name = "stripe_payment_intent_id", nullable = false, unique = true)
        private String stripePaymentIntentId;

        @Column(name = "stripe_checkout_session_id", unique = true)
        private String stripeCheckoutSessionId;

        @Column(nullable = false, precision = 12, scale = 2)
        private BigDecimal amount;

        @Column(nullable = false, length = 3)
        private String currency;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private PaymentStatus status;
}