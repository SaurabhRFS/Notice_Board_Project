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

    // --- 1. Our "Tools" ---
    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final SubjectRepository subjectRepository;

    // --- 2. The Constructor (Correct) ---
    public NoticeService(
            NoticeRepository noticeRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService,
            SubjectRepository subjectRepository
    ) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.subjectRepository = subjectRepository;
    }

    // ... (after your constructor)

    // ... (inside NoticeService.java)
   

    // --- 3. The "Create Notice" Logic (FINAL UPGRADE) ---
    @Transactional
    public Notice createNotice(
        NoticeRequest noticeRequest, // The "bucket" (now with a real date)
        String authorEmail,
        MultipartFile file
    ) throws IOException {
        
        // --- Step A: Find the author (same) ---
        User author = userRepository.findByEmail(authorEmail)
            .orElseThrow(() -> new UsernameNotFoundException("Author not found: " + authorEmail));

        // --- Step B: Create the notice (same) ---
        Notice notice = new Notice();
        notice.setTitle(noticeRequest.getTitle());
        notice.setContent(noticeRequest.getContent());
        notice.setPinned(noticeRequest.isPinned());
        notice.setTargetBranch(noticeRequest.getTargetBranch());
        notice.setTargetSemesters(noticeRequest.getTargetSemesters());
        notice.setAuthor(author);

        // --- Step C: Handle the "Subject" (same) ---
        if (noticeRequest.getSubjectId() != null) {
            Subject subject = subjectRepository.findById(noticeRequest.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found"));
            notice.setSubject(subject);
        }

        // --- Step D: Handle the "Expires At" Date (NOW SIMPLER) ---
        if (noticeRequest.getExpiresAt() != null) {
            // We got a real LocalDate, just convert it to a LocalDateTime
            notice.setExpiresAt(noticeRequest.getExpiresAt().atStartOfDay());
        }

        // --- Step E: Handle the "File Upload" (same) ---
        if (file != null && !file.isEmpty()) {
            String fileUrl = fileStorageService.uploadFile(file);
            notice.getAttachmentUrls().add(fileUrl);
        }

        // --- Step F: Save (same) ---
        return noticeRepository.save(notice);
    }

    // --- 4. "Smart Delete" Logic (Correct) ---
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

    // --- 5. "Add Attachment" Logic (Correct) ---
    @Transactional
    public Notice addAttachmentToNotice(Long noticeId, MultipartFile file) throws IOException {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));
        String fileUrl = fileStorageService.uploadFile(file);
        notice.getAttachmentUrls().add(fileUrl);
        return noticeRepository.save(notice);
    }

    // --- 6. The NEW "Smart Filter" Logic (Correct) ---
    @Transactional(readOnly = true)
    public List<Notice> findFilteredNotices(
        Long subjectId, 
        Branch branch, 
        Semester semester
    ) {
        // This method just passes the (optional) filters
        // to our custom "smart query" in the repository.
        return noticeRepository.findFilteredNotices(subjectId, branch, semester);
    }
}


// package com.NoticeBoard.noticeboard.service;

// import com.NoticeBoard.noticeboard.dto.NoticeRequest;
// import com.NoticeBoard.noticeboard.exception.NoticeNotFoundException;
// import com.NoticeBoard.noticeboard.exception.SubjectNotFoundException;
// import com.NoticeBoard.noticeboard.model.Notice;
// import com.NoticeBoard.noticeboard.model.Role;
// import com.NoticeBoard.noticeboard.model.Subject;
// import com.NoticeBoard.noticeboard.model.User;
// import com.NoticeBoard.noticeboard.repository.NoticeRepository;
// import com.NoticeBoard.noticeboard.repository.SubjectRepository;
// import com.NoticeBoard.noticeboard.repository.UserRepository;
// import org.springframework.security.access.AccessDeniedException;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.util.List;

// @Service // This labels the class as our "Manager"
// public class NoticeService {

//     // --- 1. Our "Tools" ---
//     private final NoticeRepository noticeRepository;
//     private final UserRepository userRepository;
//     private final FileStorageService fileStorageService;
//     private final SubjectRepository subjectRepository;

//     // --- 2. The Constructor (to get all 4 tools) ---
//     public NoticeService(
//             NoticeRepository noticeRepository,
//             UserRepository userRepository,
//             FileStorageService fileStorageService,
//             SubjectRepository subjectRepository
//     ) {
//         this.noticeRepository = noticeRepository;
//         this.userRepository = userRepository;
//         this.fileStorageService = fileStorageService;
//         this.subjectRepository = subjectRepository;
//     }

//     // --- 3. The "Create Notice" Logic (UPGRADED) ---
//     @Transactional
//     public Notice createNotice(NoticeRequest noticeRequest, String authorEmail) {

//         User author = userRepository.findByEmail(authorEmail)
//                 .orElseThrow(() -> new UsernameNotFoundException("Author not found: " + authorEmail));

//         Notice notice = new Notice();
//         notice.setTitle(noticeRequest.getTitle());
//         notice.setContent(noticeRequest.getContent());
//         notice.setExpiresAt(noticeRequest.getExpiresAt());
//         notice.setPinned(noticeRequest.isPinned());
//         notice.setTargetBranch(noticeRequest.getTargetBranch());
//         notice.setTargetSemesters(noticeRequest.getTargetSemesters());
//         notice.setAuthor(author);

//         // --- NEW "SMART" LOGIC ---
//         // Check if the teacher provided a Subject ID
//         if (noticeRequest.getSubjectId() != null) {
//             // If they did, find that Subject in the database
//             Subject subject = subjectRepository.findById(noticeRequest.getSubjectId())
//                     .orElseThrow(() -> new SubjectNotFoundException("Subject not found with ID: " + noticeRequest.getSubjectId()));
            
//             // If found, link it to the new notice
//             notice.setSubject(subject);
//         }
        
//         return noticeRepository.save(notice);
//     }

//     // --- 4. The "Get All Notices" Logic (UPGRADED "Smart Feed") ---
//     @Transactional(readOnly = true)
//     public List<Notice> getAllNotices(String userEmail) {
        
//         // A. Find the user who is making the request
//         User user = userRepository.findByEmail(userEmail)
//                 .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

//         // B. Check their role
//         if (user.getRole().equals(Role.ROLE_ADMIN) || user.getRole().equals(Role.ROLE_TEACHER)) {
            
//             // C. If they are an Admin or Teacher, return ALL notices (sorted)
//             return noticeRepository.findAllByOrderByIsPinnedDescUpdatedAtDesc();
        
//         } else {
            
//             // D. If they are a Student, run our NEW "Smart Feed" query
//             return noticeRepository.findNoticesForUser(
//                 user.getBranch(), 
//                 user.getSemester()
//             );
//         }
//     }

//     // --- 5. The "Smart Delete" Logic ---
//     @Transactional
//     public void deleteNotice(Long noticeId, String userEmail) {
        
//         User user = userRepository.findByEmail(userEmail)
//                 .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

//         Notice notice = noticeRepository.findById(noticeId)
//                 .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));

//         // Check permissions
//         boolean isAdmin = user.getRole().equals(Role.ROLE_ADMIN);
//         boolean isAuthor = notice.getAuthor().equals(user);

//         // If they are NOT an admin AND they are NOT the author, block them.
//         if (!isAdmin && !isAuthor) {
//             throw new AccessDeniedException("You do not have permission to delete this notice.");
//         }

//         noticeRepository.delete(notice);
//     }

//     // --- 6. The "Add Attachment" Logic ---
//     @Transactional
//     public Notice addAttachmentToNotice(Long noticeId, MultipartFile file) throws IOException {
        
//         Notice notice = noticeRepository.findById(noticeId)
//                 .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));

//         // Upload the file using our FileStorageService
//         String fileUrl = fileStorageService.uploadFile(file);

//         // Add the new file's URL to the notice's list
//         notice.getAttachmentUrls().add(fileUrl);

//         // Save the updated notice
//         return noticeRepository.save(notice);
//     }
// }