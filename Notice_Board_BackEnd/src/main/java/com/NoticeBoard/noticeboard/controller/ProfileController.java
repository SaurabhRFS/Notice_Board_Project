package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.dto.ProfileUpdateRequest;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile") // 1. The base URL for all profile actions
public class ProfileController {

    // 2. Our "Tool" (the "User Manager")
    private final UserService userService;

    // 3. The Constructor
    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    // 4. The "Update My Details" Endpoint
    @PutMapping("/my-details")
    public ResponseEntity<User> updateMyDetails(
        @RequestBody ProfileUpdateRequest request, // The "bucket" with new details
        Authentication authentication // The user's "wristband"
    ) {
        
        // 5. Get the user's email *from the token*
        String userEmail = authentication.getName();

        // 6. Call the "Manager" to do the work
        // This is secure! We only use the email from the token.
        User updatedUser = userService.updateUserProfile(userEmail, request);

        // 7. Return the updated user object
        return ResponseEntity.ok(updatedUser);
    }
}
