package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.dto.SubjectRequest;
import com.NoticeBoard.noticeboard.model.Subject;
import com.NoticeBoard.noticeboard.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.NoticeBoard.noticeboard.model.User;

@RestController
@RequestMapping("/api/admin") // 1. The base URL for ALL admin actions
public class AdminController {

    // 2. Our "Tool" (the "Admin's Manager")
    private final AdminService adminService;

    // 3. The Constructor (to get our tool)
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // 4. The "Create Subject" Endpoint
    @PostMapping("/subjects")
    public ResponseEntity<Subject> createSubject(@RequestBody SubjectRequest subjectRequest) {
        
        // 5. Call the "Manager" to do the work
        Subject newSubject = adminService.createSubject(subjectRequest);
        
        // 6. Return the new subject
        return new ResponseEntity<>(newSubject, HttpStatus.CREATED);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // This is already secure (Admin only) because of our SecurityConfig
        return ResponseEntity.ok(adminService.getAllUsers());
    }
}