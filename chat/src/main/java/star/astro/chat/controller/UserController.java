package star.astro.chat.controller;

import org.springframework.web.bind.annotation.*;
import star.astro.chat.model.Chatroom;
import star.astro.chat.model.Friend;
import star.astro.chat.model.User;
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
    public boolean addUserByEmail(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        return userService.createUserByName(username, password);
    }

    @GetMapping("/user")
    public User getUserByName(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.retrieveUserByName(username);
    }

    @PostMapping("/login")
    public boolean login(@RequestParam Map<String, Object> params, HttpServletRequest request) {
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        boolean granted = userService.login(username, password);
        if (granted) {
            userService.userOnline(username);
            request.getSession().setAttribute("username", username);
        }
        return granted;
    }

    @PostMapping("/user/friend")
    public boolean addFriend(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String friendName = (String) params.get("friendName");
        return userService.addFriend(username, friendName);
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

    @GetMapping("/user/room")
    public List<Friend> getPrivateChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.getFriends(username);
    }

    @GetMapping("/chatroom")
    public List<Chatroom> getUserChatrooms(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        return userService.getChatrooms(username);
    }

}
