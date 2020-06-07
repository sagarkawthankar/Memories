package com.memories.web.collection;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString

public class ElasticUser {
    String userID;
    String title;
}
