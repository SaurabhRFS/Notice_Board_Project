package com.NoticeBoard.noticeboard.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    
    // These are the fields we expect from React
    private String email;
    private String username;
    private String password;
    
    // We can also add our Branch and Semester here
    // private String branch; 
    // private String semester;
    // For now, let's keep it simple.
    
}
