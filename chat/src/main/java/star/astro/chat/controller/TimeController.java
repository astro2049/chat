package star.astro.chat.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import star.astro.chat.service.TimeService;

@RestController
public class TimeController {

    private final TimeService timeService;

    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    @GetMapping("/time")
    public String getTime() {
        String UTCTime = timeService.getTime();
        return "UTC Time: " + UTCTime;
    }

}
