package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User appUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(appUser.getRole().name());

        // --- THE CRASH FIX ---
        // Google users have no password (null). 
        // We use a dummy string "" so Spring Security doesn't crash.
        String password = (appUser.getPassword() != null) ? appUser.getPassword() : "";

        return new org.springframework.security.core.userdetails.User(
            appUser.getEmail(),
            password, 
            Collections.singletonList(authority)
        );
    }
}