package star.astro.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import star.astro.chat.service.NotificationService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/new-friend")
    public ResponseEntity<?> noticeUserOfNewFriend(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        String username = (String) params.get("name");
        notificationService.noticeUserOfNewChatroom(username);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ended-friendship")
    public ResponseEntity<?> noticeUserOfAnEndedFriendship(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        String username = (String) params.get("guest_name");
        String friendName = (String) params.get("initiator_name");
        notificationService.noticeUserOfAnEndedFriendship(username, friendName);

        return ResponseEntity.noContent().build();
    }

}
