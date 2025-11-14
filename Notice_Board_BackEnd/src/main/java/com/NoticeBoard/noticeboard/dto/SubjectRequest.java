package com.NoticeBoard.noticeboard.dto;

import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Semester;
import lombok.Data;

@Data // Lombok gives us getters/setters
public class SubjectRequest {
    
    // These are the 3 fields an admin must provide
    private String name;
    private Branch branch;
    private Semester semester;
}
