package star.astro.chat.model.wrapper;

public class Chatroom {

    private String chatroomId;
    private String name; // name of friend / chatroom
    private int type;

    public Chatroom(String chatroomId, String name, int type) {
        this.chatroomId = chatroomId;
        this.name = name;
        this.type = type;
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

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

}
