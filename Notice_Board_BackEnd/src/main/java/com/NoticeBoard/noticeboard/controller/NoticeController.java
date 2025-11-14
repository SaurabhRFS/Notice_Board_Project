package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.dto.NoticeRequest;
import com.NoticeBoard.noticeboard.exception.NoticeNotFoundException;
import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Notice;
import com.NoticeBoard.noticeboard.model.Semester;
import com.NoticeBoard.noticeboard.service.NoticeService;

// --- Imports for the "Date Translator" ---
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart; // <-- NEW IMPORT
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    // --- We need the ObjectMapper "translator" now ---
    private final ObjectMapper objectMapper;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
        
        // --- Create the "translator" and "install" the Date tool ---
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    // --- "Create Notice" Endpoint (FINAL UPGRADE) ---
    @PostMapping
    public ResponseEntity<Notice> createNotice(
        // Catches the "text" part of the form
        @RequestPart("notice") String noticeRequestJson, 
        
        // Catches the "file" part (optional)
        @RequestPart(value = "file", required = false) MultipartFile file,
        
        Authentication authentication // The user's "wristband"
    ) {
        
        try {
            // 1. Use our "translator" to convert the JSON string into our "bucket"
            NoticeRequest noticeRequest = objectMapper.readValue(noticeRequestJson, NoticeRequest.class);

            // 2. Get the user's email
            String authorEmail = authentication.getName();

            // 3. Call the "Manager" with all the pieces
            Notice newNotice = noticeService.createNotice(noticeRequest, authorEmail, file);
            
            return new ResponseEntity<>(newNotice, HttpStatus.CREATED);
        
        } catch (Exception e) {
            e.printStackTrace(); // This prints the *real* error to your Spring terminal!
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- "Get All Notices" (Smart Filter) Endpoint (Correct) ---
    @GetMapping
    public ResponseEntity<List<Notice>> getFilteredNotices(
        @RequestParam(required = false) Long subjectId,
        @RequestParam(required = false) Branch branch,
        @RequestParam(required = false) Semester semester
    ) {
        List<Notice> notices = noticeService.findFilteredNotices(subjectId, branch, semester);
        return ResponseEntity.ok(notices);
    }

    // --- "Delete Notice" Endpoint (Correct) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotice(
        @PathVariable Long id,
        Authentication authentication
    ) {
        String userEmail = authentication.getName();
        try {
            noticeService.deleteNotice(id, userEmail);
            return ResponseEntity.ok("Notice deleted successfully.");
        } catch (NoticeNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (AccessDeniedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    // --- "Upload File" Endpoint (This is now part of Create Notice) ---
    // We can delete the old /upload endpoint if we want, but it's fine to leave it.
}