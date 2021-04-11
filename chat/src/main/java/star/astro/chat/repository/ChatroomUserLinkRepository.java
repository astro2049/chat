package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.link.ChatroomUserLink;

import java.util.List;

@Repository
public interface ChatroomUserLinkRepository extends MongoRepository<ChatroomUserLink, String> {

    List<ChatroomUserLink> findChatroomUserLinkByUsername(String username);

}
