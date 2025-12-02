package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.dto.NoticeRequest;
import com.NoticeBoard.noticeboard.exception.NoticeNotFoundException;
import com.NoticeBoard.noticeboard.exception.SubjectNotFoundException;
import com.NoticeBoard.noticeboard.model.Branch; // <-- Cleaned up imports
import com.NoticeBoard.noticeboard.model.Notice;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.Semester; // <-- Cleaned up imports
import com.NoticeBoard.noticeboard.model.Subject;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.NoticeRepository;
import com.NoticeBoard.noticeboard.repository.SubjectRepository;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate; // <-- Make sure this is imported

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
public class NoticeService {

    // ... (fields and constructor remain the same) ...
    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final SubjectRepository subjectRepository;

    public NoticeService(NoticeRepository noticeRepository, UserRepository userRepository, FileStorageService fileStorageService, SubjectRepository subjectRepository) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.subjectRepository = subjectRepository;
    }

    // --- UPDATED CREATE LOGIC ---
    @Transactional
    public Notice createNotice(
        NoticeRequest noticeRequest, 
        String authorEmail,
        List<MultipartFile> files // <-- Change to List
    ) throws IOException {
        
        User author = userRepository.findByEmail(authorEmail)
            .orElseThrow(() -> new UsernameNotFoundException("Author not found: " + authorEmail));

        Notice notice = new Notice();
        notice.setTitle(noticeRequest.getTitle());
        notice.setContent(noticeRequest.getContent());
        notice.setPinned(noticeRequest.isPinned());
        notice.setTargetBranch(noticeRequest.getTargetBranch());
        notice.setTargetSemesters(noticeRequest.getTargetSemesters());
        notice.setAuthor(author);

        if (noticeRequest.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(noticeRequest.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found"));
            notice.setSubject(subject);
        }

        if (noticeRequest.getExpiresAt() != null) {
            notice.setExpiresAt(noticeRequest.getExpiresAt().atStartOfDay());
        }

        // --- CHANGE: Loop through the list of files ---
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                // Upload each file
                String fileUrl = fileStorageService.uploadFile(file);
                // Add URL to the notice's list
                notice.getAttachmentUrls().add(fileUrl);
            }
        }

        return noticeRepository.save(notice);
    }

    // ... (Keep deleteNotice, findFilteredNotices, addAttachmentToNotice as they were) ...
    @Transactional
    public void deleteNotice(Long noticeId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));
        boolean isAdmin = user.getRole().equals(Role.ROLE_ADMIN);
        boolean isAuthor = notice.getAuthor().equals(user);
        if (!isAdmin && !isAuthor) {
            throw new AccessDeniedException("You do not have permission to delete this notice.");
        }
        noticeRepository.delete(notice);
    }

    @Transactional
    public Notice addAttachmentToNotice(Long noticeId, MultipartFile file) throws IOException {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));
        String fileUrl = fileStorageService.uploadFile(file);
        notice.getAttachmentUrls().add(fileUrl);
        return noticeRepository.save(notice);
    }

    @Transactional(readOnly = true)
    public List<Notice> findFilteredNotices(Long subjectId, Branch branch, Semester semester) {
        return noticeRepository.findFilteredNotices(subjectId, branch, semester);
    }
}