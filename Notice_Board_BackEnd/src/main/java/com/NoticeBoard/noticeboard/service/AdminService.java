package com.NoticeBoard.noticeboard.service;

import com.NoticeBoard.noticeboard.dto.SubjectRequest;
import com.NoticeBoard.noticeboard.model.Role;
import com.NoticeBoard.noticeboard.model.Subject;
import com.NoticeBoard.noticeboard.model.User;
import com.NoticeBoard.noticeboard.repository.SubjectRepository;
import com.NoticeBoard.noticeboard.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public AdminService(SubjectRepository subjectRepository, UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    // --- 1. Create Subject ---
    @Transactional
    public Subject createSubject(SubjectRequest subjectRequest) {
        Subject newSubject = new Subject();
        newSubject.setName(subjectRequest.getName());
        newSubject.setBranch(subjectRequest.getBranch());
        newSubject.setSemester(subjectRequest.getSemester());
        return subjectRepository.save(newSubject);
    }

    // --- 2. Get All Users ---
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- 3. Promote User Logic ---
    @Transactional
    public void promoteUserToTeacher(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        user.setRole(Role.ROLE_TEACHER);
        userRepository.save(user);
    }

    // --- 4. NEW: Update Subject ---
    @Transactional
    public Subject updateSubject(Long subjectId, SubjectRequest request) {
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        subject.setName(request.getName());
        subject.setBranch(request.getBranch());
        subject.setSemester(request.getSemester());
        
        return subjectRepository.save(subject);
    }

    // --- 5. NEW: Delete Subject ---
    @Transactional
    public void deleteSubject(Long subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new RuntimeException("Subject not found");
        }
        subjectRepository.deleteById(subjectId);
    }
}