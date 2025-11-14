package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.dto.SubjectRequest;
import com.NoticeBoard.noticeboard.model.Subject;
import com.NoticeBoard.noticeboard.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NoticeBoard.noticeboard.repository.UserRepository; // <-- 1. NEW IMPORT
import com.NoticeBoard.noticeboard.model.User; // <-- 2. NEW IMPORT
import java.util.List; // <-- 3. NEW IMPORT

@Service // Labels this as our new "Manager"
public class AdminService {

    // 1. Our "Tool" (the "file clerk" for subjects)
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository; // <-- 4. ADD NEW TOOL

    // 5. UPDATE CONSTRUCTOR
    public AdminService(SubjectRepository subjectRepository, UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository; // <-- 6. SAVE NEW TOOL
    }

    // 3. The "Create Subject" Logic
    @Transactional
    public Subject createSubject(SubjectRequest subjectRequest) {
        
        // We can add a check here later to see if the subject already exists
        
        // A. Create the new Subject entity
        Subject newSubject = new Subject();
        
        // B. Copy data from the "bucket" (DTO) to our entity
        newSubject.setName(subjectRequest.getName());
        newSubject.setBranch(subjectRequest.getBranch());
        newSubject.setSemester(subjectRequest.getSemester());

        // C. Save the new subject to the database
        return subjectRepository.save(newSubject);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // We will add the "promoteUser" logic here later
}