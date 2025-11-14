package com.NoticeBoard.noticeboard.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // Added a column name for consistency
    private Long id;

    // --- THIS IS THE FIELD THAT WAS MISSING ---
    @Column(name = "Email", nullable = false, unique = true)
    private String email;
    // ------------------------------------------

    @Column(name = "User_Name", nullable = false)
    private String username;

    @Column(nullable = true) // Optional for Google users
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