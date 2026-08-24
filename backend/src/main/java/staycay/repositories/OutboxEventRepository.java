package staycay.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import staycay.models.OutboxEvent;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {
    public List<OutboxEvent> findTop100ByPublishedFalseOrderByCreatedAtAsc();
}
