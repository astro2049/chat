package star.astro.chat.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import star.astro.chat.model.Notification;

import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class NotificationService {

    SimpMessagingTemplate simpMessagingTemplate;

    public void sendMessage(String username, Notification notification) {
        simpMessagingTemplate.convertAndSend("/topic/notice." + username, notification);
    }

    public void noticeUserOfNewChatroom(String username) {
        Notification notification = new Notification(
                "system",
                username,
                NotificationType.NEWCHATROOM.getType(),
                new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new Date()));
        sendMessage(username, notification);
    }

    private enum NotificationType {
        NEWCHATROOM(0);

        private final int type;

        NotificationType(int type) {
            this.type = type;
        }

        public int getType() {
            return type;
        }
    }

}
