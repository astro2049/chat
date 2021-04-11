package star.astro.chat.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import star.astro.chat.model.Chatroom;
import star.astro.chat.model.Friend;
import star.astro.chat.model.User;
import star.astro.chat.service.UserService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {

    private UserService userService;

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

    @GetMapping("/login")
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

    @GetMapping("/private/room")
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
