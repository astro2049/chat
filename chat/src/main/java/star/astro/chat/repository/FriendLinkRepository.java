package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.mongodb.link.FriendLink;

import java.util.List;

@Repository
public interface FriendLinkRepository extends MongoRepository<FriendLink, String> {

    List<FriendLink> findAllByUsername0OrUsername1(String username0, String username1);

}
