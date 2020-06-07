package com.memories.web.controller;

import java.util.*;
import com.auth0.jwt.JWT;
import java.time.LocalDateTime;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import java.util.stream.Collectors;
import org.json.simple.parser.JSONParser;
import com.memories.web.builder.Document;
import java.time.format.DateTimeFormatter;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import com.memories.web.collection.Documents;
import javax.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.memories.web.accessor.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
public class DocumentsController {

    @Autowired
    DocumentRepository repository;

    public void uploadToElastic(Document userDetails) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "Your AWS ElasticSearch URL/userdata/_doc";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> map = new HashMap<>();
        map.put("userId", userDetails.getUserID());
        map.put("title", userDetails.getTitle());
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(map, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        System.out.println(response.getBody());
    }

    public String retrieveFromElastic(String title) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "Your AWS ElasticSearch URL/userdata/_search";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        JSONObject finalJson = new JSONObject();
        JSONObject middleJson = new JSONObject();
        JSONObject lastJson = new JSONObject();
        lastJson.put("title", title);
        middleJson.put("term", lastJson);
        finalJson.put("query", middleJson);
        HttpEntity<String> entity = new HttpEntity<>(finalJson.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response.getBody();
    }

    @PostMapping("/upload")
    public boolean upload(@RequestBody Document userDetails, HttpServletRequest request) {
        String token = request.getHeader("Token");
        if (token != null) {
            try {
                String user = JWT.require(Algorithm.HMAC512("SecretKeyToGenJWTs".getBytes()))
                        .build()
                        .verify(token.replace("Bearer ", ""))
                        .getSubject();
                if (user != null && user.equals(userDetails.getUserID())) {
                    try{
                        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
                        LocalDateTime now = LocalDateTime.now();
                        repository.save(Documents.builder()
                                .userID(userDetails.getUserID())
                                .title(userDetails.getTitle())
                                .description(userDetails.getDescription())
                                .date(dtf.format(now)).build());
                        uploadToElastic(userDetails);
                    } catch (Exception e) {
                        System.out.println(e.toString());
                        return false;
                    }
                    return true;
                }
            } catch (Exception e) {
                System.out.println(e.toString());
                return false;
            }
        }
        return false;
    }

    @GetMapping("/retrieve")
    public List<Document> retrieve(@RequestParam String userID, HttpServletRequest request) {
        List<Document> userDocuments = new ArrayList<>();
        String token = request.getHeader("Token");
        if (token != null) {
            try {
                String user = JWT.require(Algorithm.HMAC512("SecretKeyToGenJWTs".getBytes()))
                        .build()
                        .verify(token.replace("Bearer ", ""))
                        .getSubject();
                if (user != null && user.equals(userID)) {
                    try {
                        for (Documents document : repository.findAllByUserID(userID)) {
                            userDocuments.add(Document.builder()
                                    .userID(document.getUserID())
                                    .title(document.getTitle())
                                    .description(document.getDescription())
                                    .date(document.getDate()).build());
                        }
                    } catch (Exception e) {
                        System.out.println(e.toString());
                    }
                }
            } catch (Exception e) {
                System.out.println(e.toString());
            }
        }
        return userDocuments;
    }

    @GetMapping("/search")
    public List<Document> search(@RequestParam String userID, @RequestParam String title, HttpServletRequest request) {
        Set<Document> userDocuments = new HashSet<>();
        String token = request.getHeader("Token");
        if (token != null) {
            try {
                String user = JWT.require(Algorithm.HMAC512("SecretKeyToGenJWTs".getBytes()))
                        .build()
                        .verify(token.replace("Bearer ", ""))
                        .getSubject();
                if (user != null && user.equals(userID)) {
                    try {
                        Set<String> record = new HashSet<>();
                        JSONParser parser = new JSONParser();
                        JSONObject json = (JSONObject) parser.parse(retrieveFromElastic(title));
                        JSONObject kson = (JSONObject) parser.parse(json.get("hits").toString());
                        JSONArray lson = (JSONArray) kson.get("hits");
                        Iterator i = lson.iterator();
                        while (i.hasNext()) {
                            JSONObject k = (JSONObject) i.next();
                            JSONObject l = (JSONObject) parser.parse(k.get("_source").toString());
                            record.add(l.get("title").toString());
                        }
                        for (String r: record) {
                            for (Documents document : repository.findAllByUserIDAndTitle(userID, r)) {
                                userDocuments.add(Document.builder()
                                        .userID(document.getUserID())
                                        .title(document.getTitle())
                                        .description(document.getDescription())
                                        .date(document.getDate()).build());
                            }
                        }
                    } catch (Exception e) {
                        System.out.println(e.toString());
                    }
                }
            } catch (Exception e) {
                System.out.println(e.toString());
            }
        }
        return userDocuments.stream().collect(Collectors.toList());
    }
}
