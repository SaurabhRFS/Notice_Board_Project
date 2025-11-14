package com.NoticeBoard.noticeboard.dto;

import com.NoticeBoard.noticeboard.model.Branch;
import com.NoticeBoard.noticeboard.model.Semester;
import lombok.Data;

@Data // Lombok gives us getters/setters
public class ProfileUpdateRequest {
    
    // We don't include email or username.
    // We only allow them to change their branch and semester.
    private Branch branch;
    private Semester semester;
}