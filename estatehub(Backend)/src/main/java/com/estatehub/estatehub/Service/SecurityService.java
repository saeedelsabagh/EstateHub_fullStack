package com.estatehub.estatehub.Service;

import com.estatehub.estatehub.DTO.LoginDTO;
import com.estatehub.estatehub.DTO.UserDTO;
import com.estatehub.estatehub.Exception.LoginException;
import com.estatehub.estatehub.Repository.UserRepo;
import com.estatehub.estatehub.model.User;
import com.estatehub.estatehub.Security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    private final UserRepo UserRepo;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public SecurityService(
            UserRepo UserRepo,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.UserRepo = UserRepo;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    private User convertToEntity(UserDTO dto) {

        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        String role = dto.getRole();

        if (role == null || role.isBlank()) {
            role = "USER";
        }

        if (!role.equals("USER") && !role.equals("AGENT")) {
            throw new IllegalArgumentException("Invalid role");
        }

        user.setRole(role);

        return user;
    }

    private UserDTO convertToDTO(User user) {

        UserDTO dto = new UserDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());

        return dto;
    }

    public UserDTO addUser(UserDTO dto) {

        User user = convertToEntity(dto);

        User savedUser = UserRepo.save(user);

        return convertToDTO(savedUser);
    }

    public String login(LoginDTO dto) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.getEmail(),
                            dto.getPassword()
                    )
            );

            return jwtService.generateToken(dto.getEmail());

        } catch (BadCredentialsException e) {
            throw new LoginException("Invalid email or password");
        }
    }

}