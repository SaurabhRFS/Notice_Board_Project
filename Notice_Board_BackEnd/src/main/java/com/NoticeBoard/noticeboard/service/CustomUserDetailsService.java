package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable; // 1. Import
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
    // 2. OPTIMIZATION: Cache user details!
    // This stops the DB hit on every single API call.
    @Cacheable("users") 
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User appUser = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(appUser.getRole().name());
        String password = (appUser.getPassword() != null) ? appUser.getPassword() : "";

        return new org.springframework.security.core.userdetails.User(
            appUser.getEmail(),
            password, 
            Collections.singletonList(authority)
        );
    }
}