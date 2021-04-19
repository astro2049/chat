package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.GroupChat;

@Repository
public interface ChatroomRepository extends MongoRepository<GroupChat, String> {

    GroupChat findChatroomById(String Id);

}
