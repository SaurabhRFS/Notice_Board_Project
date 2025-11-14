package com.NoticeBoard.noticeboard.repository;

import com.NoticeBoard.noticeboard.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

// This interface is our "file clerk" for Subjects
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    // By extending JpaRepository, we automatically get methods like:
    // save(), findById(), findAll(), delete()
    
    // We can add custom finders here later if we need them,
    // like findByName(...)

}