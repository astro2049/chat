package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.exception.CustomException;
import star.astro.chat.exception.UnAuthorizedException;
import star.astro.chat.model.wrapper.Chatroom;
import star.astro.chat.service.UserService;
import star.astro.chat.util.JwtUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> addUserByNickname(@RequestBody Map<String, Object> params) {
        try {
            String username = (String) params.get("username");
            String password = (String) params.get("password");
            userService.createUserByNickname(username, password);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (CustomException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JSONObject> login(@RequestBody Map<String, Object> params) {
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

    @GetMapping("/{username}/me")
    public ResponseEntity<?> getChatrooms(@PathVariable String username, HttpServletRequest request) {
        try {
            String token = request.getHeader("token");
            jwtUtil.authorize(token, username);
            List<Chatroom> chatrooms = userService.getUserChatrooms(username);
            JSONObject ret = new JSONObject();
            ret.put("chatrooms", chatrooms);
            return new ResponseEntity<>(ret, HttpStatus.OK);
        } catch (UnAuthorizedException uae) {
            return new ResponseEntity<>(uae.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/{username}/friends/{friendName}")
    public ResponseEntity<?> addFriend(@PathVariable String username, @PathVariable String friendName, HttpServletRequest request) {
        try {
            String token = request.getHeader("token");
            jwtUtil.authorize(token, username);
            userService.addFriend(username, friendName);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (UnAuthorizedException uae) {
            return new ResponseEntity<>(uae.getMessage(), HttpStatus.FORBIDDEN);
        } catch (CustomException ce) {
            return new ResponseEntity<>(ce.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
