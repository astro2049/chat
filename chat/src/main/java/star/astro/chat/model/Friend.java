package star.astro.chat.model;

public class Friend {

    private String friend;
    private String chatroomId;

    public Friend(String friend, String chatroomId) {
        this.friend = friend;
        this.chatroomId = chatroomId;
    }

    public String getFriend() {
        return friend;
    }

    public void setFriend(String friend) {
        this.friend = friend;
    }

    public String getChatroomId() {
        return chatroomId;
    }

    public void setChatroomId(String chatroomId) {
        this.chatroomId = chatroomId;
    }

}
