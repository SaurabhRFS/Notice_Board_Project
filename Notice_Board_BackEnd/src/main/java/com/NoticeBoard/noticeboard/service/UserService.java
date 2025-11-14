package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.dto.ProfileUpdateRequest;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // Labels this as our new "Manager"
public class UserService {

    // 1. Our "Tool" (the "file clerk" for users)
    private final UserRepository userRepository;

    // 2. The Constructor (to get our tool)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 3. The "Update Profile" Logic
    @Transactional
    public User updateUserProfile(String userEmail, ProfileUpdateRequest request) {
        
        // A. Find the user from their token email
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

        // B. Update their details from the "bucket"
        user.setBranch(request.getBranch());
        user.setSemester(request.getSemester());

        // C. Save the updated user
        return userRepository.save(user);
    }

    // We can add the "promoteUser" logic (from AdminService) here later
    // to keep all user logic in one place.
}