package staycay.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import staycay.dto.ConversationResponse;
import staycay.models.Message;
import staycay.repositories.MessageRepository;
import staycay.repositories.ReservationRepository;
import staycay.repositories.UserRepository;
import staycay.security.UserPrincipal;
import staycay.services.MessageService;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageRepository messageRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final MessageService messageService;


    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(
                                                                       @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(
                messageService.getConversations(principal.userId())
        );
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<MessageResponse>> getMessages(
                                                             @PathVariable Long reservationId, @AuthenticationPrincipal UserPrincipal principal) {
        var reservation = reservationRepository.findById(reservationId).orElse(null);
        if (!canAccess(reservation, principal.userId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(messageRepository.findByReservationIdOrderByCreatedAtAsc(reservationId).stream().map(MessageResponse::from).toList());
    }

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
                                                       @AuthenticationPrincipal UserPrincipal principal, @RequestBody CreateMessageRequest request) {
        var reservation = reservationRepository.findById(request.reservationId()).orElse(null);
        var user = userRepository.findById(principal.userId()).orElse(null);
        if (!canAccess(reservation, principal.userId()) || user == null || request.content() == null || request.content().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Message message = new Message();
        message.setReservation(reservation);
        message.setUser(user);
        message.setContent(request.content().trim());
        return ResponseEntity.ok(MessageResponse.from(messageRepository.save(message)));
    }

    private boolean canAccess(staycay.models.Reservation reservation, Long userId) {
        return reservation != null && ((reservation.getUser() != null && reservation.getUser().getId().equals(userId)) || (reservation.getHost() != null && reservation.getHost().getId().equals(userId)));
    }

    public record MessageResponse(Long id, Long userId, String content, LocalDateTime createdAt) {
        static MessageResponse from(Message message) {
            return new MessageResponse(message.getId(), message.getUser().getId(), message.getContent(), message.getCreatedAt());
        }
    }

    public record CreateMessageRequest(Long reservationId, String content) {
    }
}
