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

    @PostMapping
    public ResponseEntity<Notice> createNotice(
        @RequestPart("notice") String noticeRequestJson, 
        @RequestPart(value = "files", required = false) List<MultipartFile> files, 
        Authentication authentication
    ) {
        try {
            NoticeRequest noticeRequest = objectMapper.readValue(noticeRequestJson, NoticeRequest.class);
            String authorEmail = authentication.getName();
            Notice newNotice = noticeService.createNotice(noticeRequest, authorEmail, files);
            return new ResponseEntity<>(newNotice, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // --- UPDATED: GET Endpoint with Pagination ---
    // Change return type to Slice
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Slice<Notice>> getFilteredNotices(
        @RequestParam(required = false) Long subjectId,
        @RequestParam(required = false) Branch branch,
        @RequestParam(required = false) Semester semester,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        org.springframework.data.domain.Slice<Notice> notices = noticeService.findFilteredNotices(subjectId, branch, semester, page, size);
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