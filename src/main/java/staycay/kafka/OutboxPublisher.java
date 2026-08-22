package staycay.kafka;

import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import staycay.models.OutboxEvent;
import staycay.repositories.OutboxEventRepository;

@Component
@RequiredArgsConstructor
public class OutboxPublisher {

    private final OutboxEventRepository outboxRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Scheduled(fixedDelay = 1000)
    public void publishEvents() {

        List<OutboxEvent> events =
                outboxRepository
                        .findTop100ByPublishedFalseOrderByCreatedAtAsc();

        for (OutboxEvent event : events) {
            kafkaTemplate.send(
                    event.getTopic(),
                    event.getId().toString(),
                    event.getPayload()
            );

            event.setPublished(true);
            outboxRepository.save(event);
        }
    }
}