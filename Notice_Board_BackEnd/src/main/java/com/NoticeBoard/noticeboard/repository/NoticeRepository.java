package com.NoticeBoard.noticeboard.repository;

import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Notice;
import com.NoticeBoard.noticeboard.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // --- THIS IS THE NEW "SMART FILTER" QUERY ---
    @Query(
        value = "SELECT n FROM Notice n " +
                "LEFT JOIN n.targetSemesters s " +
                "WHERE " +
                // Filter 1: Subject (if provided)
                "(:subjectId IS NULL OR n.subject.id = :subjectId) " +
                
                // Filter 2: Branch (if provided, or 'GENERAL')
                "AND (:branch IS NULL OR n.targetBranch = :branch OR n.targetBranch = 'GENERAL') " +
                
                // Filter 3: Semester (if provided, or 'ALL_SEMESTERS')
                "AND (:semester IS NULL OR s = :semester OR s = 'ALL_SEMESTERS' OR n.targetSemesters IS EMPTY) " +
                
                "GROUP BY n.id " +
                "ORDER BY n.isPinned DESC, n.updatedAt DESC"
    )
    List<Notice> findFilteredNotices(
        @Param("subjectId") Long subjectId, 
        @Param("branch") Branch branch, 
        @Param("semester") Semester semester
    );

    // This is still used for Admins/Teachers to see everything
    List<Notice> findAllByOrderByIsPinnedDescUpdatedAtDesc();
}