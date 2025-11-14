package com.NoticeBoard.noticeboard.dto;

import lombok.Data;

@Data // Lombok gives us getters and setters
public class LoginRequest {
    private String email;
    private String password;
}