package com.NoticeBoard.noticeboard.dto;

import lombok.Data;
// We use Lombok to reduce boilerplate code {like getters/setters}
@Data
public class AuthResponse {
    
    private String token;
    private String role; // <-- NEW FIELD

    // We use a constructor to make it easy to create
    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }
}