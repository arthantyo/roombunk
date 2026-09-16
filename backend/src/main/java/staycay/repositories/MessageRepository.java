package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import staycay.models.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReservationIdOrderByCreatedAtAsc(Long reservationId);


    @Query("""
                SELECT m
                FROM Message m
                WHERE m.reservation.user.id = :userId
                   OR m.reservation.host.id = :userId
                ORDER BY m.createdAt DESC
            """)
    List<Message> findAllConversationsForUser(@Param("userId") Long userId);
}
