package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import star.astro.chat.service.UserService;

import java.util.Map;

@RestController
public class ChatroomController {

    @Autowired
    private UserService userService;

    @PostMapping("/chatroom")
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

}
