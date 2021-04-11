package star.astro.chat.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import star.astro.chat.model.ChatMessage;

@Controller
public class ChatController {

    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/private/{room}")
    public void sendPrivateMessage(@DestinationVariable String room, @Payload ChatMessage chatMessage) {
        simpMessagingTemplate.convertAndSend("/topic/private/" + room, chatMessage);
    }

    @MessageMapping("/chatroom/{room}")
    public void sendChatroomMessage(@DestinationVariable String room, @Payload ChatMessage chatMessage) {
        simpMessagingTemplate.convertAndSend("/topic/chatroom" + room, chatMessage);
    }

}
