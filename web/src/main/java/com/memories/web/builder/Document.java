package com.memories.web.builder;

import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class Document {
    private String userID;
    private String title;
    private String description;
    private String date;
}
