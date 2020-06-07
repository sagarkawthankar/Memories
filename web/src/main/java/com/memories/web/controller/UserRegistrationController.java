package com.memories.web.controller;

import com.memories.web.collection.User;
import com.memories.web.accessor.UserRepository;
import com.memories.web.builder.UserRegistration;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
public class UserRegistrationController {

    @Autowired
    UserRepository repository;

    @PostMapping("/register")
    public boolean register(@RequestBody UserRegistration payLoad) {
        try {
            if (repository.findByUserID(payLoad.getUserID()) != null) {
                return true;
            }
            else {
                repository.save(User.builder()
                        .userID(payLoad.getUserID())
                        .firstName(payLoad.getFirstName())
                        .lastName(payLoad.getLastName())
                        .password(payLoad.getPassword()).build());
                return false;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return true;
        }
    }
}
