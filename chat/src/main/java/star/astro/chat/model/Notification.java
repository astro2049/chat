package star.astro.chat.model;

public class Notification {

    private String sender;
    private String receiver;
    private int type;
    private String time;

    public Notification() {

    }

    public Notification(String sender, String receiver, int type, String time) {
        this.sender = sender;
        this.receiver = receiver;
        this.type = type;
        this.time = time;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

}
