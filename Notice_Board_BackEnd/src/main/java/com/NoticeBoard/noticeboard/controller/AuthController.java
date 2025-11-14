package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.dto.AuthResponse;
import com.NoticeBoard.noticeboard.dto.LoginRequest;
import com.NoticeBoard.noticeboard.dto.RegisterRequest;
import com.NoticeBoard.noticeboard.model.AuthProvider;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import com.NoticeBoard.noticeboard.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationProvider authenticationProvider;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationProvider authenticationProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationProvider = authenticationProvider;
    }

    // "Register" endpoint
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email address already in use.", HttpStatus.BAD_REQUEST);
        }
        User newUser = new User();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRole(Role.ROLE_STUDENT); // Default to Student
        newUser.setAuthProvider(AuthProvider.LOCAL);
        userRepository.save(newUser);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    // "Login" endpoint (Upgraded)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        
        try {
            // 1. Authenticate the user
            Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );

            // --- THIS IS THE UPGRADE ---
            // 2. Get the user's email
            String email = authentication.getName();
            
            // 3. Get the user's role (the "Authority")
            // We get the first (and only) role from the list of authorities
            String role = authentication.getAuthorities().iterator().next().getAuthority();

            // 4. Create the "wristband" (token)
            String token = jwtService.generateToken(email);

            // 5. Send back BOTH the token AND the role
            return ResponseEntity.ok(new AuthResponse(token, role));

        } catch (Exception e) {
            return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }
    }
}