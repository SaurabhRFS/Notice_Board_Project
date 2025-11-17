package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.model.AuthProvider;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // 1. This is a "Manager" class
public class FirebaseService {

    // --- 2. Our "Tools" ---
    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;

    // --- 3. The Constructor ---
    public FirebaseService(FirebaseApp firebaseApp, UserRepository userRepository) {
        // We get the "tool" from our "factory" and get the auth manager from it
        this.firebaseAuth = FirebaseAuth.getInstance(firebaseApp); 
        this.userRepository = userRepository;
    }

    // --- 4. The Main "Handshake" Method ---
    @Transactional
    public User verifyTokenAndGetUser(String idToken) {
        try {
            // A. This is the "handshake"
            // We ask Firebase HQ to verify the "wristband"
            FirebaseToken decodedToken = this.firebaseAuth.verifyIdToken(idToken);
            
            // B. If it's real, get the user's info
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();

            // C. Find or create the user in *our* database
            // This is the "smart" part
            User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    // If they don't exist, create them
                    System.out.println("Creating new Google (Firebase) user: " + email);
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(name); // Get the name from Google
                    newUser.setRole(Role.ROLE_STUDENT); // Default to Student
                    newUser.setAuthProvider(AuthProvider.GOOGLE); // Set provider
                    // Password is 'null' because they use Firebase
                    return userRepository.save(newUser);
                });

            return user;

        } catch (Exception e) {
            // If the token is fake, expired, or invalid
            throw new UsernameNotFoundException("Invalid Firebase Token: " + e.getMessage());
        }
    }
}