package com.estatehub.estatehub.AllTests;

import com.estatehub.estatehub.Repository.UserRepo;
import com.estatehub.estatehub.Service.UserService;
import com.estatehub.estatehub.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {
    @Mock UserRepo userRepo;
    @InjectMocks UserService userService;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setName("Saeed");
        user.setEmail("saeed@example.com");
        user.setRole("USER");
    }

    @Test
    void getAllUsersReturnsUsers() {
        when(userRepo.findAll()).thenReturn(List.of(user));
        List<User> result = userService.getAllUsers();
        assertEquals(1, result.size());
        assertEquals("saeed@example.com", result.get(0).getEmail());
        verify(userRepo).findAll();
    }

    @Test
    void getAllUsersReturnsEmptyList() {
        when(userRepo.findAll()).thenReturn(List.of());
        assertTrue(userService.getAllUsers().isEmpty());
        verify(userRepo).findAll();
    }

    @Test
    void findUserByEmailReturnsUser() {
        when(userRepo.findByEmail("saeed@example.com")).thenReturn(Optional.of(user));
        Optional<User> result = userService.findUserByEmail("saeed@example.com");
        assertTrue(result.isPresent());
        assertEquals(1, result.get().getId());
        verify(userRepo).findByEmail("saeed@example.com");
    }

    @Test
    void findUserByEmailReturnsEmptyWhenMissing() {
        when(userRepo.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertTrue(userService.findUserByEmail("missing@example.com").isEmpty());
        verify(userRepo).findByEmail("missing@example.com");
    }
}
