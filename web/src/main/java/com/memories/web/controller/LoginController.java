package com.memories.web.controller;

import java.util.Date;
import com.auth0.jwt.JWT;
import com.memories.web.builder.Login;
import javax.servlet.http.HttpServletResponse;
import com.memories.web.accessor.UserRepository;
import org.springframework.web.bind.annotation.*;
import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
public class LoginController {

    @Autowired
    UserRepository repository;

    @PostMapping("/login")
    public boolean register(@RequestBody Login userDetails, HttpServletResponse response) {
        try{
            if (repository.findUserByUserIDAndPassword(userDetails.getUserID(), userDetails.getPassword()) != null) {
                String token = JWT.create()
                        .withSubject(userDetails.getUserID())
                        .withExpiresAt(new Date(System.currentTimeMillis() + 24*60*60))
                        .sign(HMAC512("SecretKeyToGenJWTs".getBytes()));
                response.addHeader("Access-Control-Expose-Headers", "Token");
                response.setHeader("Token", "Bearer " + token);
                return true;
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
        return false;
    }
}
