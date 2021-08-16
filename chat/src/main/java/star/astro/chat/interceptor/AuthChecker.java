package star.astro.chat.interceptor;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import star.astro.chat.model.mongodb.User;
import star.astro.chat.repository.UserRepository;
import star.astro.chat.util.JwtUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AuthChecker implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }
        boolean granted = false;
        String token = request.getHeader("token");// 从 http 请求头中取出 token
        if (token != null) {
            String username;
            try {
                username = JWT.decode(token).getAudience().get(0);
                User user = userRepository.findUserByName(username);
                boolean verified = jwtUtil.verifyToken(token, user);
                if (verified) {
                    granted = true;
                }
            } catch (JWTDecodeException ignored) {

            }
        }
        if (granted) {
            return true;
        } else {
            response.setStatus(401);
            return false;
        }
    }

}
