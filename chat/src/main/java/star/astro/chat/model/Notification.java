package star.astro.chat.model;

public class Notification extends Message {

    private int type;
    private String content;

    public Notification() {

    }

    public Notification(String sender, String receiver, int type, String time) {
        this.sender = sender;
        this.receiver = receiver;
        this.type = type;
        this.content = null;
        this.time = time;
    }

    public Notification(String sender, String receiver, int type, String content, String time) {
        this.sender = sender;
        this.receiver = receiver;
        this.type = type;
        this.content = content;
        this.time = time;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
