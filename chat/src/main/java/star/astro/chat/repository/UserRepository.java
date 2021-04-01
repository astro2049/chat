package star.astro.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import star.astro.chat.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findUserByName(String name);

}
