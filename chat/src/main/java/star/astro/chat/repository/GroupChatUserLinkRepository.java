package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.mongodb.link.GroupChatUserLink;

import java.util.List;

@Repository
public interface GroupChatUserLinkRepository extends MongoRepository<GroupChatUserLink, String> {

    GroupChatUserLink findByUsernameAndChatroomId(String username, String chatroomId);

    List<GroupChatUserLink> findByUsername(String username);

}
