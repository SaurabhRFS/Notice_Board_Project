package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.dto.NoticeRequest;
import com.NoticeBoard.noticeboard.exception.NoticeNotFoundException;
import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Notice;
import com.NoticeBoard.noticeboard.model.Semester;
import com.NoticeBoard.noticeboard.service.NoticeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;
    private final ObjectMapper objectMapper;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    // --- UPDATED CREATE ENDPOINT ---
    @PostMapping
    public ResponseEntity<Notice> createNotice(
        @RequestPart("notice") String noticeRequestJson, 
        // 1. CHANGE: Accept a List<MultipartFile> and match the key "files"
        @RequestPart(value = "files", required = false) List<MultipartFile> files, 
        Authentication authentication
    ) {
        try {
            NoticeRequest noticeRequest = objectMapper.readValue(noticeRequestJson, NoticeRequest.class);
            String authorEmail = authentication.getName();

            // 2. Pass the list to the service
            Notice newNotice = noticeService.createNotice(noticeRequest, authorEmail, files);
            
            return new ResponseEntity<>(newNotice, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ... (Keep getFilteredNotices and deleteNotice as they were) ...
    @GetMapping
    public ResponseEntity<List<Notice>> getFilteredNotices(
        @RequestParam(required = false) Long subjectId,
        @RequestParam(required = false) Branch branch,
        @RequestParam(required = false) Semester semester
    ) {
        List<Notice> notices = noticeService.findFilteredNotices(subjectId, branch, semester);
        return ResponseEntity.ok(notices);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotice(@PathVariable Long id, Authentication authentication) {
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
}