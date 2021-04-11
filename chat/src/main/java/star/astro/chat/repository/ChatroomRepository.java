package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.Chatroom;

@Repository
public interface ChatroomRepository extends MongoRepository<Chatroom, String> {

    Chatroom findChatroomById(String Id);

}
