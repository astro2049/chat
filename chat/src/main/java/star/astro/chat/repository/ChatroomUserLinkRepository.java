package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.link.GroupChatUserLink;

import java.util.List;

@Repository
public interface ChatroomUserLinkRepository extends MongoRepository<GroupChatUserLink, String> {

    List<GroupChatUserLink> findChatroomUserLinkByUsername(String username);

}
