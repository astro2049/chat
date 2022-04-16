package star.astro.chat.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import star.astro.chat.model.Notification;

import java.util.List;

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

    public void noticeUserOfAnEndedFriendship(String username, String friendName) {
        JSONObject content = new JSONObject();
        content.put("friend_name", friendName);
        Notification notification = new Notification(
                "system",
                username,
                NotificationType.ENDED_FRIENDSHIP.getType(),
                JSON.toJSONString(content),
                timeService.getUnixTime());
        sendMessage(username, notification);
    }

    public void noticeMembersOfDisbandedChatRoom(int id, List<String> members) {
        JSONObject content = new JSONObject();
        content.put("id", id);
        for (String memberName : members) {
            Notification notification = new Notification(
                    "system",
                    memberName,
                    NotificationType.CHATROOM_DISBANDED.getType(),
                    JSON.toJSONString(content),
                    timeService.getUnixTime());
            sendMessage(memberName, notification);
        }
    }

    public enum NotificationType {
        ACKNOWLEDGE_SUBSCRIPTION(0),
        NEW_CHATROOM(1),
        ENDED_FRIENDSHIP(2),
        CHATROOM_DISBANDED(3);

        private final int type;

        NotificationType(int type) {
            this.type = type;
        }

        public int getType() {
            return type;
        }
    }

}
