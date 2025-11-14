// package com.NoticeBoard.noticeboard.util;

// import com.NoticeBoard.noticeboard.model.AuthProvider;
// import com.NoticeBoard.noticeboard.model.Role;
// import com.NoticeBoard.noticeboard.model.User;
// import com.NoticeBoard.noticeboard.repository.UserRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Component;

// @Component
// public class DataInitializer implements CommandLineRunner {

//     private final UserRepository userRepository;
//     private final PasswordEncoder passwordEncoder; // <-- It's final

//     // --- THIS IS THE CORRECT CONSTRUCTOR ---
//     // It asks Spring for BOTH tools (the "file clerk" and the "lock")
//     public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//         this.userRepository = userRepository;
//         this.passwordEncoder = passwordEncoder;
//     }

//     @Override
//     public void run(String... args) throws Exception {
        
//         // This code now uses the *SHARED, CORRECT* "lock"
//         if (userRepository.findByEmail("admin@noticeboard.com").isEmpty()) {
//             System.out.println("Creating ADMIN user...");
            
//             User admin = new User();
//             admin.setEmail("admin@noticeboard.com");
//             admin.setUsername("Admin");
//             admin.setPassword(passwordEncoder.encode("promoteme123")); // Use the new password
//             admin.setRole(Role.ROLE_ADMIN);
//             admin.setAuthProvider(AuthProvider.LOCAL);
//             userRepository.save(admin);
//             System.out.println("ADMIN user created!");
//         }

//         if (userRepository.findByEmail("student@noticeboard.com").isEmpty()) {
//             System.out.println("Creating STUDENT user...");
            
//             User studentUser = new User();
//             studentUser.setEmail("student@noticeboard.com");
//             studentUser.setUsername("Student");
//             studentUser.setPassword(passwordEncoder.encode("studentpass"));
//             studentUser.setRole(Role.ROLE_STUDENT);
//             studentUser.setAuthProvider(AuthProvider.LOCAL);
//             userRepository.save(studentUser);
//             System.out.println("STUDENT user created!");
//         }
//     }
// }

package com.NoticeBoard.noticeboard.util;

import com.NoticeBoard.noticeboard.model.AuthProvider;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        
        // --- Create ADMIN User ---
        // This 'if' check prevents creating duplicate users on restart
        if (userRepository.findByEmail("admin@noticeboard.com").isEmpty()) {
            System.out.println("Creating ADMIN user...");
            
            User admin = new User();
            admin.setEmail("admin@noticeboard.com");
            admin.setUsername("Admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ROLE_ADMIN);
            admin.setAuthProvider(AuthProvider.LOCAL);
            userRepository.save(admin);
            
            System.out.println("ADMIN user created!");
        }

        // --- Create STUDENT User ---
        // This 'if' check is also a safety check
        if (userRepository.findByEmail("student@noticeboard.com").isEmpty()) {
            System.out.println("Creating STUDENT user...");

            User studentUser = new User();
            studentUser.setEmail("student@noticeboard.com");
            studentUser.setUsername("Student");
            studentUser.setPassword(passwordEncoder.encode("student123"));
            studentUser.setRole(Role.ROLE_STUDENT);
            studentUser.setAuthProvider(AuthProvider.LOCAL);
            userRepository.save(studentUser);

            System.out.println("STUDENT user created!");
        }

        // --- NEW: Create TEACHER User ---
        if (userRepository.findByEmail("teacher@noticeboard.com").isEmpty()) {
            System.out.println("Creating TEACHER user...");

            User teacherUser = new User();
            teacherUser.setEmail("teacher@noticeboard.com");
            teacherUser.setUsername("Teacher");
            teacherUser.setPassword(passwordEncoder.encode("teacher123"));
            teacherUser.setRole(Role.ROLE_TEACHER); // <-- Set the role to TEACHER
            teacherUser.setAuthProvider(AuthProvider.LOCAL);
            userRepository.save(teacherUser);

            System.out.println("TEACHER user created!");
        }
    }
}