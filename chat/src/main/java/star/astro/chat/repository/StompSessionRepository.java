package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.mongodb.StompSession;

@Repository
public interface StompSessionRepository extends MongoRepository<StompSession, String> {

    StompSession findStompSessionBySessionId(String sessionId);

}
