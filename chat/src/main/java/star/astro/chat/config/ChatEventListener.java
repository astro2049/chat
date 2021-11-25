package star.astro.chat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import star.astro.chat.model.mongodb.StompSession;
import star.astro.chat.repository.StompSessionRepository;

import java.util.Date;

@Component
public class ChatEventListener {

    @Autowired
    private StompSessionRepository stompSessionRepository;

    // not perfect to create session here
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        try {
            String username = headerAccessor.getNativeHeader("username").get(0);
            StompSession stompSession = new StompSession(sessionId, username);
            stompSessionRepository.save(stompSession);
            System.out.println("[" + username + "] is online\t\t\t" + new Date());
        } catch (NullPointerException e) {
            System.out.println(e.getMessage());
        }
    }


    @EventListener
    public void handleWebSocketConnectedListener(SessionConnectedEvent event) {
        System.out.println("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        try {
            StompSession stompSession = stompSessionRepository.findStompSessionBySessionId(sessionId);
            String username = stompSession.getUsername();
            stompSessionRepository.delete(stompSession);
            System.out.println("[" + username + "] is offline\t\t\t" + new Date());
        } catch (NullPointerException e) {
            System.out.println(e.getMessage());
        }
    }

}
