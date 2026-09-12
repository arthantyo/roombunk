package staycay.controllers;

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
import staycay.models.Message;
import staycay.repositories.MessageRepository;
import staycay.repositories.ReservationRepository;
import staycay.repositories.UserRepository;
import staycay.security.UserPrincipal;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageRepository messageRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long reservationId) {
        return ResponseEntity.ok(messageRepository.findByReservationIdOrderByCreatedAtAsc(reservationId));
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(
                                               @AuthenticationPrincipal UserPrincipal principal, @RequestBody CreateMessageRequest request) {
        var reservation = reservationRepository.findById(request.reservationId()).orElse(null);
        var user = userRepository.findById(principal.userId()).orElse(null);
        if (reservation == null || user == null || request.content() == null || request.content().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Message message = new Message();
        message.setReservation(reservation);
        message.setUser(user);
        message.setContent(request.content().trim());
        return ResponseEntity.ok(messageRepository.save(message));
    }

    public record CreateMessageRequest(Long reservationId, String content) {
    }
}
