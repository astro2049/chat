package star.astro.chat.model;

public class ChatMessage extends Message {

    private int chatId;
    private String type;
    private String content;

    public ChatMessage() {
    }

    public ChatMessage(int chatId, String type, String sender, String receiver, String content, String time) {
        this.chatId = chatId;
        this.type = type;
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.time = time;
    }

    public int getChatId() {
        return chatId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

}
