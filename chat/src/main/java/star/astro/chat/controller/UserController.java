package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.exception.RegisterOnTakenUsernameException;
import star.astro.chat.model.wrapper.Chatroom;
import star.astro.chat.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> addUserByNickname(@RequestParam Map<String, Object> params) {
        try {
            String username = (String) params.get("username");
            String password = (String) params.get("password");
            userService.createUserByNickname(username, password);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RegisterOnTakenUsernameException e) {
            return new ResponseEntity<>("username already taken", HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JSONObject> login(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        boolean granted = userService.login(username, password);
        if (granted) {
            JSONObject ret = new JSONObject();
            String token = userService.getToken(username);
            ret.put("username", username);
            ret.put("token", token);
            return new ResponseEntity<>(ret, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/friends")
    public ResponseEntity<JSONObject> addFriend(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String friendName = (String) params.get("friendName");
        boolean success = userService.addFriend(username, friendName);
        if (success) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PutMapping("/chatrooms")
    public JSONObject joinChatroom(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        try {
            String username = (String) params.get("username");
            String chatroomId = (String) params.get("chatroomId");
            boolean success = userService.joinChatroom(username, chatroomId);
            ret.put("success", success);
        } catch (Exception e) {
            ret.put("success", false);
            ret.put("exc", e.getMessage());
        }
        return ret;
    }

    @GetMapping("/chatrooms")
    public JSONObject getChatrooms(@RequestParam Map<String, Object> params) {
        JSONObject ret = new JSONObject();
        try {
            String username = (String) params.get("username");
            List<Chatroom> chatrooms = userService.getUserChatrooms(username);
            ret.put("success", true);
            ret.put("chatrooms", chatrooms);
        } catch (Exception e) {
            ret.put("success", false);
            ret.put("exc", e.getMessage());
        }
        return ret;
    }

}
