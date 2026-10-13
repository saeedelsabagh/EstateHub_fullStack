package com.estatehub.estatehub.Service;

import com.estatehub.estatehub.Repository.UserRepo;
import com.estatehub.estatehub.model.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // Find user by email
    public Optional<User> findUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}