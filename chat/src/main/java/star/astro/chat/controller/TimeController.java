package star.astro.chat.controller;

import com.alibaba.fastjson.JSONObject;
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
    public JSONObject getTime() {
        JSONObject ret = new JSONObject();
        JSONObject UTCTime = timeService.getTime();
        ret.put("UTCTime", UTCTime);
        return ret;
    }

}
