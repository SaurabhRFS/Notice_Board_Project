package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.dto.NoticeRequest;
import com.NoticeBoard.noticeboard.exception.NoticeNotFoundException;
import com.NoticeBoard.noticeboard.exception.SubjectNotFoundException;
import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Notice;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.Semester;
import com.NoticeBoard.noticeboard.model.Subject;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.NoticeRepository;
import com.NoticeBoard.noticeboard.repository.SubjectRepository;
import com.NoticeBoard.noticeboard.repository.UserRepository;

import org.springframework.cache.annotation.CacheEvict;      // Added
import org.springframework.cache.annotation.Cacheable;    // Added

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final SubjectRepository subjectRepository;

    public NoticeService(NoticeRepository noticeRepository,
                         UserRepository userRepository,
                         FileStorageService fileStorageService,
                         SubjectRepository subjectRepository) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.subjectRepository = subjectRepository;
    }

    // ---------------------------------------------------------
    // CREATE NOTICE + CLEAR CACHE
    // ---------------------------------------------------------
    @Transactional
    @CacheEvict(value = "notices", allEntries = true)
    public Notice createNotice(NoticeRequest noticeRequest,
                               String authorEmail,
                               List<MultipartFile> files) throws IOException {

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

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String fileUrl = fileStorageService.uploadFile(file);
                notice.getAttachmentUrls().add(fileUrl);
            }
        }

        return noticeRepository.save(notice);
    }

    // ---------------------------------------------------------
    // DELETE NOTICE + CLEAR CACHE
    // ---------------------------------------------------------
    @Transactional
    @CacheEvict(value = "notices", allEntries = true)
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

    // ---------------------------------------------------------
    // ADD ATTACHMENT (No cache clear needed)
    // ---------------------------------------------------------
    @Transactional
    public Notice addAttachmentToNotice(Long noticeId, MultipartFile file) throws IOException {

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));

        String fileUrl = fileStorageService.uploadFile(file);
        notice.getAttachmentUrls().add(fileUrl);

        return noticeRepository.save(notice);
    }

    // ---------------------------------------------------------
    // GET FILTERED NOTICES — CACHED
    // ---------------------------------------------------------
    @Transactional(readOnly = true)
    @Cacheable(value = "notices", key = "{#subjectId, #branch, #semester, #page, #size}")
    public org.springframework.data.domain.Slice<Notice> findFilteredNotices(
            Long subjectId,
            Branch branch,
            Semester semester,
            int page,
            int size) {

        Sort sort = Sort.by(Sort.Direction.DESC, "isPinned")
                        .and(Sort.by(Sort.Direction.DESC, "updatedAt"));

        Pageable pageable = PageRequest.of(page, size, sort);

        return noticeRepository.findFilteredNotices(subjectId, branch, semester, pageable);
    }
}