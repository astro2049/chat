package star.astro.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import star.astro.chat.service.NotificationService;

import javax.servlet.http.HttpServletRequest;
import java.net.http.HttpRequest;
import java.util.Map;

@Controller
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping("/new-friend")
    public ResponseEntity<?> noticeUserOfNewFriend(@RequestBody Map<String, Object> params, HttpServletRequest request) {
        String username = (String) params.get("name");
        System.out.println(username);
        notificationService.noticeUserOfNewChatroom(username);

        return ResponseEntity.noContent().build();
    }

}
