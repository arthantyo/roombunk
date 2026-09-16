
package staycay.services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import staycay.dto.ConversationResponse;
import staycay.models.Message;
import staycay.models.Reservation;
import staycay.models.User;
import staycay.repositories.MessageRepository;


@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;


    public List<ConversationResponse> getConversations(Long userId) {
        List<Message> messages = messageRepository.findAllConversationsForUser(userId);

        Map<Long, Message> latestMessages = new LinkedHashMap<>();

        for (Message message : messages) {
            latestMessages.putIfAbsent(
                    message.getReservation().getId(), message
            );
        }

        return latestMessages.values().stream().map(message -> {
            Reservation reservation = message.getReservation();

            User otherUser;

            if (reservation.getUser().getId().equals(userId)) {
                otherUser = reservation.getHost();
            } else {
                otherUser = reservation.getUser();
            }

            return new ConversationResponse(
                    reservation.getId(), otherUser.getId(), otherUser.getUsername(), message.getContent(), message.getCreatedAt(), reservation.getStatus()
            );
        }).toList();
    }

}
