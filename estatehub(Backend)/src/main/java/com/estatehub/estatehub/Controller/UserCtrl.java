package com.estatehub.estatehub.Controller;

import com.estatehub.estatehub.Service.UserService;
import com.estatehub.estatehub.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
@RestController
public class UserCtrl {

    private final UserService userService;

    public UserCtrl(UserService userService) {
        this.userService = userService;
    }

    // Get all users

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Find user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> findUserByEmail(
            @PathVariable String email
    ) {
        return userService.findUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole()
                )
        );
    }
}