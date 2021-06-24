package star.astro.chat.model;

public class Notification extends Message {

    private int type;

    public Notification() {

    }

    public Notification(String sender, String receiver, int type, String time) {
        this.sender = sender;
        this.receiver = receiver;
        this.type = type;
        this.time = time;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

}
