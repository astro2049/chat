package star.astro.chat.util;

import org.springframework.stereotype.Component;
import star.astro.chat.exception.NotAcceptableUGCException;

@Component
public class UGCValidator {

    public void validateNames(String... names) throws NotAcceptableUGCException {
        for (String name : names) {
            int len = name.length();
            if (len >= 2 && len <= 46) {
                continue;
            } else {
                throw new NotAcceptableUGCException("invalid name");
            }
        }
    }

}
