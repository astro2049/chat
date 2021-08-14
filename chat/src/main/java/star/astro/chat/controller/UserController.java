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

    @GetMapping("/me")
    public ResponseEntity<JSONObject> getChatrooms(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        List<Chatroom> chatrooms = userService.getUserChatrooms(username);
        JSONObject ret = new JSONObject();
        ret.put("chatrooms", chatrooms);
        return new ResponseEntity<>(ret, HttpStatus.OK);
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

    @PostMapping("/chatrooms")
    public ResponseEntity<?> joinChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String chatroomId = (String) params.get("chatroomId");
        userService.joinChatroom(username, chatroomId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
