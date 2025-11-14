package com.NoticeBoard.noticeboard.dto;

import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Semester;
import com.fasterxml.jackson.annotation.JsonProperty; // <-- 1. NEW IMPORT
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class NoticeRequest {
    
    private String title;
    private String content;
    private Long subjectId;
    private LocalDate expiresAt;
    private Branch targetBranch;
    private List<Semester> targetSemesters;

    // --- 2. THIS IS THE FINAL FIX ---
    // This annotation forces Jackson to use the name "isPinned"
    // and stops it from getting confused.
    @JsonProperty("isPinned")
    private boolean isPinned = false;
}