package star.astro.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.exception.CustomException;
import star.astro.chat.exception.UnAuthorizedException;
import star.astro.chat.service.ChatroomService;
import star.astro.chat.util.JwtUtil;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/chatrooms")
public class ChatroomController {

    @Autowired
    private ChatroomService chatroomService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("")
    public ResponseEntity<?> createChatroom(@RequestParam Map<String, Object> params, HttpServletRequest request) {
        String username = (String) params.get("username");
        String chatroomName = (String) params.get("chatroomName");
        try {
            String token = request.getHeader("token");
            jwtUtil.authorize(token, username);
            chatroomService.createChatroom(username, chatroomName);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (UnAuthorizedException uae) {
            return new ResponseEntity<>(uae.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/{chatroomId}/users/{username}")
    public ResponseEntity<?> addUser(@PathVariable String chatroomId, @PathVariable String username, HttpServletRequest request) {
        try {
            String token = request.getHeader("token");
            jwtUtil.authorize(token, username);
            chatroomService.addUser(username, chatroomId);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (UnAuthorizedException uae) {
            return new ResponseEntity<>(uae.getMessage(), HttpStatus.FORBIDDEN);
        } catch (CustomException ce) {
            return new ResponseEntity<>(ce.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
    }

}
