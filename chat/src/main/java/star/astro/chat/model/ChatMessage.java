package star.astro.chat.model;

public class ChatMessage extends Message {

    private String content;

    public ChatMessage() {
    }

    public ChatMessage(String sender, String receiver, String content, String time) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.time = time;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
