package star.astro.chat.util;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class BcryptUtil {

    public String hashPassword(String plaintext) {
        return BCrypt.hashpw(plaintext, BCrypt.gensalt());
    }

    public boolean checkPassword(String candidate, String hashed) {
        return BCrypt.checkpw(candidate, hashed);
    }

}
