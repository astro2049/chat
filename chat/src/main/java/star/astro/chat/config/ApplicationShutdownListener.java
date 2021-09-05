package star.astro.chat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class ApplicationShutdownListener implements ApplicationListener<ContextClosedEvent> {

    @Value("${spring.profiles.active}")
    private String environment;
    @Value("${spring.data.mongodb.database}")
    private String database;
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void onApplicationEvent(ContextClosedEvent contextClosedEvent) {
        if (environment.equals("test")) {
            System.out.println(new Date() + "\t - TEST - \t\t Dropping database " + "[" + database + "]");
            mongoTemplate.getDb().drop();
        }
    }

}
