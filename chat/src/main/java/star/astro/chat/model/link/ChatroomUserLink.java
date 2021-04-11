package star.astro.chat.model.link;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class ChatroomUserLink {

    @Id
    private String id;
    private String chatroom;
    private String username;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getChatroom() {
        return chatroom;
    }

    public void setChatroom(String chatroom) {
        this.chatroom = chatroom;
    }

    public String getUser() {
        return username;
    }

    public void setUser(String username) {
        this.username = username;
    }

}
