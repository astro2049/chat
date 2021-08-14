package star.astro.chat.exception;

public class RegisterOnTakenUsernameException extends Exception {

    public RegisterOnTakenUsernameException() {
        super("user already exists");
    }

}
