package com.NoticeBoard.noticeboard.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- 1. Import This
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(name = "Email", nullable = false, unique = true)
    private String email;

    @Column(name = "User_Name", nullable = false)
    private String username;

    // --- 2. OPTIMIZATION: Hide Password ---
    // This stops the password hash from being sent to the frontend.
    // Smaller Data = Faster Download.
    @JsonIgnore 
    @Column(nullable = true)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "Branch", nullable = true)
    private Branch branch;

    @Enumerated(EnumType.STRING)
    @Column(name = "Semester", nullable = true)
    private Semester semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "Auth_Provider", nullable = false)
    private AuthProvider authProvider;
}