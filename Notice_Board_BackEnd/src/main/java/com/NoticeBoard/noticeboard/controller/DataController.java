package com.NoticeBoard.noticeboard.controller;

import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Semester;
import com.NoticeBoard.noticeboard.model.Subject;
import com.NoticeBoard.noticeboard.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/data") // A new "workshop" for data
public class DataController {

    private final SubjectRepository subjectRepository;

    public DataController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // 1. Endpoint for Subjects
    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        // Just return all subjects from the database
        return ResponseEntity.ok(subjectRepository.findAll());
    }

    // 2. Endpoint for Branches
    @GetMapping("/branches")
    public ResponseEntity<List<Branch>> getAllBranches() {
        // Just return all the values from our Branch enum
        return ResponseEntity.ok(Arrays.asList(Branch.values()));
    }

    // 3. Endpoint for Semesters
    @GetMapping("/semesters")
    public ResponseEntity<List<Semester>> getAllSemesters() {
        // Just return all the values from our Semester enum
        return ResponseEntity.ok(Arrays.asList(Semester.values()));
    }
}