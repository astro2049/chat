package star.astro.chat.model.wrapper;

public enum ChatroomType {

    PRIVATECHAT(0),
    GROUPCHAT(1);

    private final int value;

    ChatroomType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

}
