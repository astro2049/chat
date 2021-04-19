package star.astro.chat.model.wrapper;

public class Chatroom {

    private String chatroomId;
    private String name; // name of friend / chatroom

    public Chatroom(String chatroomId, String name) {
        this.chatroomId = chatroomId;
        this.name = name;
    }

    public String getChatroomId() {
        return chatroomId;
    }

    public void setChatroomId(String chatroomId) {
        this.chatroomId = chatroomId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
