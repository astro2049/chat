package star.astro.chat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import star.astro.chat.model.Notification;

@Service
public class NotificationService {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private TimeService timeService;

    public void sendMessage(String username, Notification notification) {
        simpMessagingTemplate.convertAndSend("/topic/notice." + username, notification);
    }

    public Notification constructSubscriptionAcknowledgeReply(String username) {
        return new Notification(
                "system",
                username,
                NotificationType.ACKNOWLEDGE_SUBSCRIPTION.getType(),
                timeService.getUnixTime());
    }

    public void noticeUserOfNewChatroom(String username) {
        Notification notification = new Notification(
                "system",
                username,
                NotificationType.NEW_CHATROOM.getType(),
                timeService.getUnixTime());
        sendMessage(username, notification);
    }

    public enum NotificationType {
        ACKNOWLEDGE_SUBSCRIPTION(0),
        NEW_CHATROOM(1);

        private final int type;

        NotificationType(int type) {
            this.type = type;
        }

        public int getType() {
            return type;
        }
    }

}
