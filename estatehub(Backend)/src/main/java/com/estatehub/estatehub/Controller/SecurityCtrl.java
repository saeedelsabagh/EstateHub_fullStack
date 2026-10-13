package com.estatehub.estatehub.Controller;

import com.estatehub.estatehub.DTO.LoginDTO;
import com.estatehub.estatehub.DTO.UserDTO;
import com.estatehub.estatehub.Service.SecurityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class SecurityCtrl {

    private final SecurityService SecurityService;
    public SecurityCtrl(SecurityService SecurityService) {
        this.SecurityService = SecurityService;
    }

    @PostMapping("/adduser")
    public UserDTO addUser(
            @Valid @RequestBody UserDTO dto
    ) {
        return SecurityService.addUser(dto);
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginDTO dto) {
        return SecurityService.login(dto);
    }
}