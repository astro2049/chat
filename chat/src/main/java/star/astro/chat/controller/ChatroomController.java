package star.astro.chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import star.astro.chat.service.ChatroomService;

import java.util.Map;

@RestController
@RequestMapping("/chatrooms")
public class ChatroomController {

    @Autowired
    private ChatroomService chatroomService;

    @PostMapping("")
    public ResponseEntity<?> createChatroom(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String chatroomName = (String) params.get("chatroomName");
        chatroomService.createChatroom(username, chatroomName);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/{chatroomId}/users/{username}")
    public ResponseEntity<?> addUser(@PathVariable String chatroomId, @PathVariable String username) {
        chatroomService.addUser(username, chatroomId);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
