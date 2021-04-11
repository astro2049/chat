package star.astro.chat.model;

public class Friend {

    private User friend;
    private String chatroomId;

    public Friend(User friend, String chatroomId) {
        this.friend = friend;
        this.chatroomId = chatroomId;
    }

    public User getFriend() {
        return friend;
    }

    public void setFriend(User friend) {
        this.friend = friend;
    }

    public String getChatroomId() {
        return chatroomId;
    }

    public void setChatroomId(String chatroomId) {
        this.chatroomId = chatroomId;
    }

}
