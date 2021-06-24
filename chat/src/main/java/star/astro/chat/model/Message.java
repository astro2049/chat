package star.astro.chat.model;

public class Message {

    protected String sender;
    protected String receiver;
    protected String time;

    public Message() {

    }

    public Message(String sender, String receiver, String time) {
        this.sender = sender;
        this.receiver = receiver;
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

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

}
