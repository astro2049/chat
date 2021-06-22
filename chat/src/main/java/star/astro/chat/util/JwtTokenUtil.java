package star.astro.chat.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.stereotype.Component;
import star.astro.chat.model.mongodb.User;

@Component
public class JwtTokenUtil {

    public String getToken(User user) {
        String token;
        token = JWT.create()
                .withAudience(user.getName())
                .sign(Algorithm.HMAC256(user.getPassword()));
        return token;
    }

    public boolean verifyToken(String token, User user) {
        JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(user.getPassword())).build();
        try {
            jwtVerifier.verify(token);
            return true;
        } catch (JWTVerificationException jve) {
            return false;
        }
    }

}
