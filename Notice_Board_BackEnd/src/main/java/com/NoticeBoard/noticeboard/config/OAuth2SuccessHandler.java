package com.NoticeBoard.noticeboard.config;

import com.NoticeBoard.noticeboard.model.AuthProvider;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import com.NoticeBoard.noticeboard.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public OAuth2SuccessHandler(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request, 
        HttpServletResponse response, 
        Authentication authentication
    ) throws IOException, ServletException {

        // 1. Get user info from Google
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // 2. Find or create the user in our database
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                // If they don't exist, create them
                System.out.println("Creating new Google user: " + email);
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(name);
                newUser.setRole(Role.ROLE_STUDENT); // Default to Student
                newUser.setAuthProvider(AuthProvider.GOOGLE); // Set provider to GOOGLE
                return userRepository.save(newUser);
            });

        // --- THIS IS THE UPGRADE ---
        
        // 3. Create the "wristband" (token)
        String token = jwtService.generateToken(user.getEmail());
        
        // 4. Get the user's role
        String role = user.getRole().name();

        // 5. Send the user back to React with BOTH the token AND the role
        
        // This is the URL of your React app's "catcher" page
        String targetUrl = "http://localhost:5173/oauth2/redirect"; 
        
        String redirectUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", token)
                .queryParam("role", role) // <-- WE ADDED THE ROLE
                .build().toUriString();

        clearAuthenticationAttributes(request);
        
        // Send the user to the new URL (e.g., http://localhost:3000/oauth2/redirect?token=...&role=...)
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}