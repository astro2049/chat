package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.model.mongodb.GroupChat;
import star.astro.chat.model.wrapper.Chatroom;
import star.astro.chat.model.mongodb.User;
import star.astro.chat.service.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/user")
    public JSONObject addUserByNickname(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        boolean granted = userService.createUserByName(username, password);
        ret.put("success", granted);
        ret.put("exc", "");
        return ret;
    }

    @GetMapping("/user")
    public User getUserByName(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.retrieveUserByName(username);
    }

    @PostMapping("/login")
    public JSONObject login(@RequestParam Map<String, Object> params, HttpServletRequest request) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        boolean granted = userService.login(username, password);
        if (granted) {
            userService.userOnline(username);
            request.getSession().setAttribute("username", username);
        }
        ret.put("success", granted);
        ret.put("username", username);
        ret.put("exc", "");
        return ret;
    }

    @PostMapping("/user/friend")
    public JSONObject addFriend(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        String username = (String) params.get("username");
        String friendName = (String) params.get("friendName");
        boolean success = userService.addFriend(username, friendName);
        ret.put("success", success);
        ret.put("exc", "");
        return ret;
    }

    @PostMapping("/chatroom")
    public boolean createChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String chatroomName = (String) params.get("chatroomName");
        return userService.createChatroom(username, chatroomName);
    }

    @PutMapping("/chatroom")
    public boolean joinChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String chatroomId = (String) params.get("chatroomId");
        return userService.joinChatroom(username, chatroomId);
    }

    @GetMapping("/user/private/room")
    public List<Chatroom> getPrivateChatrooms(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.getPrivateChatrooms(username);
    }

    @GetMapping("/user/group/room")
    public List<GroupChat> getGroupChatrooms(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.getGroupChatrooms(username);
    }

}
