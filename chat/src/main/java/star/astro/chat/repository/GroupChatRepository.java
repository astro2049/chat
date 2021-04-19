package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.mongodb.GroupChat;

@Repository
public interface GroupChatRepository extends MongoRepository<GroupChat, String> {

    GroupChat findGroupChatById(String id);

}
