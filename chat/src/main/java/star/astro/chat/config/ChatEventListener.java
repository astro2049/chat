package star.astro.chat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import star.astro.chat.service.UserService;

import java.util.Objects;

@Component
public class ChatEventListener {

    @Autowired
    private UserService userService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        System.out.println("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        try {
            String username = (String) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("username");
            userService.userOffline(username);
        } catch (NullPointerException e) {
            System.out.println(e.getMessage());
        }
    }

}
