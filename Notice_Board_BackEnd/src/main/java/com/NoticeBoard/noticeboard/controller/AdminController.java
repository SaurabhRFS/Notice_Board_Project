package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.dto.SubjectRequest;
import com.NoticeBoard.noticeboard.model.Subject;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // 1. Create Subject
    @PostMapping("/subjects")
    public ResponseEntity<Subject> createSubject(@RequestBody SubjectRequest subjectRequest) {
        Subject newSubject = adminService.createSubject(subjectRequest);
        return new ResponseEntity<>(newSubject, HttpStatus.CREATED);
    }

    // 2. Get All Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 3. Promote User
    @PutMapping("/users/{id}/promote")
    public ResponseEntity<String> promoteUser(@PathVariable Long id) {
        try {
            adminService.promoteUserToTeacher(id);
            return ResponseEntity.ok("User promoted to TEACHER successfully.");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // --- 4. NEW: Update Subject ---
    @PutMapping("/subjects/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody SubjectRequest request) {
        try {
            Subject updatedSubject = adminService.updateSubject(id, request);
            return ResponseEntity.ok(updatedSubject);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // --- 5. NEW: Delete Subject ---
    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable Long id) {
        try {
            adminService.deleteSubject(id);
            return ResponseEntity.ok("Subject deleted successfully");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}