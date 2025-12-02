package com.NoticeBoard.noticeboard.util;

import com.NoticeBoard.noticeboard.model.AuthProvider;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // --- INJECT PASSWORDS FROM PROPERTIES ---
    @Value("${admin.password}") 
    private String adminPassword;

    @Value("${teacher.password}")
    private String teacherPassword;

    @Value("${student.password}")
    private String studentPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        
        // --- 1. ADMIN ---
        if (userRepository.findByEmail("admin@noticeboard.com").isEmpty()) {
            System.out.println("Creating ADMIN...");
            User admin = new User();
            admin.setEmail("admin@noticeboard.com");
            admin.setUsername("Admin");
            admin.setPassword(passwordEncoder.encode(adminPassword)); 
            admin.setRole(Role.ROLE_ADMIN);
            admin.setAuthProvider(AuthProvider.LOCAL);
            userRepository.save(admin);
        }

        // --- 2. TEACHER ---
        if (userRepository.findByEmail("teacher@noticeboard.com").isEmpty()) {
            System.out.println("Creating TEACHER...");
            User teacher = new User();
            teacher.setEmail("teacher@noticeboard.com");
            teacher.setUsername("Teacher");
            teacher.setPassword(passwordEncoder.encode(teacherPassword)); 
            teacher.setRole(Role.ROLE_TEACHER);
            teacher.setAuthProvider(AuthProvider.LOCAL);
            userRepository.save(teacher);
        }

        // --- 3. STUDENT ---
        if (userRepository.findByEmail("student@noticeboard.com").isEmpty()) {
            System.out.println("Creating STUDENT...");
            User student = new User();
            student.setEmail("student@noticeboard.com");
            student.setUsername("Student");
            student.setPassword(passwordEncoder.encode(studentPassword));
            student.setRole(Role.ROLE_STUDENT);
            student.setAuthProvider(AuthProvider.LOCAL);
            userRepository.save(student);
        }
    }
}