package com.memories.web.collection;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Data
@Builder
@Document(collection = "userDetails")
public class User {
    @Id
    private String id;
    private String userID;
    private String firstName;
    private String lastName;
    private String password;
}
