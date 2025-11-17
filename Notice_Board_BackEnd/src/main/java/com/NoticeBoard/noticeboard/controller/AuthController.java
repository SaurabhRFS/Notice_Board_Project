package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.dto.AuthResponse;
import com.NoticeBoard.noticeboard.dto.LoginRequest;
import com.NoticeBoard.noticeboard.dto.RegisterRequest;
import com.NoticeBoard.noticeboard.model.AuthProvider;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import com.NoticeBoard.noticeboard.service.FirebaseService; // <-- 1. NEW IMPORT
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

import java.util.Map; // <-- 2. NEW IMPORT

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // --- 3. Our "Tools" ---
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationProvider authenticationProvider;
    private final FirebaseService firebaseService; // <-- 4. NEW TOOL

    // --- 5. The Updated Constructor ---
    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationProvider authenticationProvider,
            FirebaseService firebaseService // <-- 6. ASK FOR THE NEW TOOL
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationProvider = authenticationProvider;
        this.firebaseService = firebaseService; // <-- 7. SAVE THE NEW TOOL
    }

    // --- 8. "Register" Endpoint (No Change) ---
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        // ... (This code is correct and unchanged)
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email address already in use.", HttpStatus.BAD_REQUEST);
        }
        User newUser = new User();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setRole(Role.ROLE_STUDENT);
		newUser.setAuthProvider(AuthProvider.LOCAL);
        userRepository.save(newUser);
        return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
    }

    // --- 9. "Local Login" Endpoint (No Change) ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        // ... (This code is correct and unchanged)
        try {
            Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(), 
                    loginRequest.getPassword()
                )
            );
            
            String email = authentication.getName();
            String role = authentication.getAuthorities().iterator().next().getAuthority();
            String token = jwtService.generateToken(email);

            return ResponseEntity.ok(new AuthResponse(token, role));

        } catch (Exception e) {
            return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }
    }

    // --- 10. NEW "FIREBASE LOGIN" ENDPOINT ---
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            // A. Get the "Firebase wristband" from the React app
            String idToken = payload.get("token");

            // B. Call our "Firebase Manager" to do the "handshake"
            // This verifies the token and finds/creates a user in our database
            User user = firebaseService.verifyTokenAndGetUser(idToken);

            // C. Create our *own* app's "wristband" (JWT)
            String ourAppToken = jwtService.generateToken(user.getEmail());
            
            // D. Get our app's "role"
            String role = user.getRole().name();

            // E. Send back our token and role, just like local login
            return ResponseEntity.ok(new AuthResponse(ourAppToken, role));
            
        } catch (Exception e) {
            // If the "handshake" fails
            return new ResponseEntity<>("Invalid Firebase token: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}