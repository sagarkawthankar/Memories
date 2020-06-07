package com.memories.web.accessor;

import com.memories.web.collection.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUserID(String userID);
    User findUserByUserIDAndPassword(String userID, String password);
}
