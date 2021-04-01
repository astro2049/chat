package star.astro.chat.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import star.astro.chat.model.User;
import star.astro.chat.service.UserService;

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

    @GetMapping("/login")
    public boolean login(@RequestParam Map<String, Object> params) {
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        return userService.login(username, password);
    }

}
