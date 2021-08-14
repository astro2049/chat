package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.service.UserService;

import java.util.Map;

@RestController
@RequestMapping("/chatrooms")
public class ChatroomController {

    @Autowired
    private UserService userService;

    @PostMapping("")
    public JSONObject createChatroom(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        try {
            String username = (String) params.get("username");
            String chatroomName = (String) params.get("chatroomName");
            boolean success = userService.createChatroom(username, chatroomName);
            ret.put("success", success);
        } catch (Exception e) {
            ret.put("success", false);
            ret.put("exc", e.getMessage());
        }
        return ret;
    }

    @PostMapping("/{chatroomId}/users/{username}")
    public ResponseEntity<?> joinChatroom(@PathVariable String chatroomId, @PathVariable String username) {
        userService.joinChatroom(username, chatroomId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
