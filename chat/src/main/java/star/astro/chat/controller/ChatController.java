package star.astro.chat.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import star.astro.chat.model.ChatMessage;

@Controller
public class ChatController {

    SimpMessagingTemplate simpMessagingTemplate;

    public ChatController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/private/{room}")
    @SendTo("/topic/private.{room}")
    public ChatMessage sendPrivateMessage(@DestinationVariable String room, @Payload ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chatroom/{room}")
    public void sendChatroomMessage(@DestinationVariable String room, @Payload ChatMessage chatMessage) {
        simpMessagingTemplate.convertAndSend("/topic/chatroom." + room, chatMessage);
    }

}
