package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.mongodb.link.FriendLink;

import java.util.List;

@Repository
public interface FriendLinkRepository extends MongoRepository<FriendLink, String> {

    @Query("{$or: [{hostUsername: ?0, guestUsername: ?1}, {hostUsername: ?1, guestUsername: ?0}]}")
    FriendLink findByHostAndGuest(String hostUsername, String guestUsername);

    @Query("{$or: [{hostUsername: ?0}, {guestUsername: ?0}]}")
    List<FriendLink> findAllByName(String username);

}
