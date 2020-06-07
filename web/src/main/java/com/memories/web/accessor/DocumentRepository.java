package com.memories.web.accessor;

import java.util.List;
import com.memories.web.collection.Documents;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;

@Repository
public interface DocumentRepository extends MongoRepository<Documents, String> {
    List<Documents> findAllByUserID(String UserID);
    List<Documents> findAllByUserIDAndTitle(String UserID, String title);
}
