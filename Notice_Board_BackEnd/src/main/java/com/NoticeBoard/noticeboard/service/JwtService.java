package com.NoticeBoard.noticeboard.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; // Import this
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // This tells Spring: "Go look in application.properties for 'jwt.secret'"
    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(String userEmail) {
        long now = System.currentTimeMillis();
        long expirationTime = now + 1000 * 60 * 60 * 24 * 7; 

        return Jwts.builder()
            .subject(userEmail)
            .issuedAt(new Date(now))
            .expiration(new Date(expirationTime))
            .signWith(getSigningKey())
            .compact();
    }

    private SecretKey getSigningKey() { 
        // Use the variable 'secretKey' instead of the hardcoded string
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getEmailFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public boolean isTokenValid(String token, String userEmail) {
        final String email = getEmailFromToken(token);
        return (email.equals(userEmail) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return getClaim(token, Claims::getExpiration).before(new Date());
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}