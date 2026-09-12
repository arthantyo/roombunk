package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import staycay.models.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByReservationIdOrderByCreatedAtAsc(Long reservationId);
}
