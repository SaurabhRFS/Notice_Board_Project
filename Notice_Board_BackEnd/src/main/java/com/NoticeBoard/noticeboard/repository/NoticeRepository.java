package com.NoticeBoard.noticeboard.repository;

import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Notice;
import com.NoticeBoard.noticeboard.model.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // --- STABLE & FAST VERSION ---
    // 1. LEFT JOIN FETCH n.author -> Gets Author instantly
    // 2. MEMBER OF -> Filters semesters cleanly
    // 3. NO GROUP BY / DISTINCT -> Prevents SQL Crashes
    
    @Query(
        value = "SELECT n FROM Notice n " +
                "LEFT JOIN FETCH n.author " +
                "WHERE " +
                "(:subjectId IS NULL OR n.subject.id = :subjectId) " +
                "AND (:branch IS NULL OR n.targetBranch = :branch OR n.targetBranch = 'GENERAL') " +
                "AND (:semester IS NULL OR n.targetSemesters IS EMPTY " +
                "     OR :semester MEMBER OF n.targetSemesters " +
                "     OR 'ALL_SEMESTERS' MEMBER OF n.targetSemesters)",
        
        countQuery = "SELECT count(n) FROM Notice n " +
                     "WHERE " +
                     "(:subjectId IS NULL OR n.subject.id = :subjectId) " +
                     "AND (:branch IS NULL OR n.targetBranch = :branch OR n.targetBranch = 'GENERAL') " +
                     "AND (:semester IS NULL OR n.targetSemesters IS EMPTY " +
                     "     OR :semester MEMBER OF n.targetSemesters " +
                     "     OR 'ALL_SEMESTERS' MEMBER OF n.targetSemesters)"
    )
    Page<Notice> findFilteredNotices(
        @Param("subjectId") Long subjectId, 
        @Param("branch") Branch branch, 
        @Param("semester") Semester semester,
        Pageable pageable
    );
}