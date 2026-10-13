package com.estatehub.estatehub.Security;

import com.estatehub.estatehub.Repository.ProperityRepo;
import com.estatehub.estatehub.model.Property;
import com.estatehub.estatehub.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.estatehub.estatehub.Repository.UserRepo;
@Service("Authorization")
public class Authorization {

    private final ProperityRepo properityRepo;
    private final UserRepo userRepository;
    public Authorization(
            ProperityRepo properityRepo,
            UserRepo userRepository
    ) {
        this.properityRepo = properityRepo;
        this.userRepository = userRepository;
    }
    // Get current logged-in user

    public User getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User) {
            return (User) principal;
        }

        if (principal instanceof String email) {
            return userRepository.findByEmail(email).orElse(null);
        }

        if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElse(null);
        }

        return null;
    }


    // Check current user's role
    public boolean isAdmin() {
        User user = getCurrentUser();

        return user != null &&
                "ADMIN".equals(user.getRole());
    }

    public boolean isAgent() {
        User user = getCurrentUser();

        return user != null &&
                "AGENT".equals(user.getRole());
    }

    public boolean isUser() {
        User user = getCurrentUser();

        return user != null &&
                "USER".equals(user.getRole());
    }

    // Check if the current user owns the given user ID
    public boolean isOwner(Integer userId) {
        User currentUser = getCurrentUser();

        return currentUser != null &&
                currentUser.getId().equals(userId);
    }

    // Check if the current user is the agent of the property
    public boolean isPropertyAgent(Integer propertyId) {
        User currentUser = getCurrentUser();

        if (currentUser == null || !isAgent()) {
            return false;
        }

        Property property = properityRepo.findById(propertyId)
                .orElse(null);

        return property != null &&
                property.getAgent() != null &&
                property.getAgent().getId().equals(currentUser.getId());
    }
}