package star.astro.chat.model.mongodb.link;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class FriendLink {

    @Id
    private String id;
    private String username0;
    private String username1;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername0() {
        return username0;
    }

    public void setUsername0(String username0) {
        this.username0 = username0;
    }

    public String getUsername1() {
        return username1;
    }

    public void setUsername1(String username1) {
        this.username1 = username1;
    }

}
