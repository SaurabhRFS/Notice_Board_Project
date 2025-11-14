package com.NoticeBoard.noticeboard.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey; // <-- 1. This is the correct import
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    // This is YOUR key. It works.
    private static final String SECRET_KEY = "THIS_IS_A_TEMPORARY_AND_VERY_INSECURE_SECRET_KEY_REPLACE_IT";

    // "Wristband Maker" (Your working code)
    public String generateToken(String userEmail) {
        long now = System.currentTimeMillis();
        long expirationTime = now + 1000 * 60 * 60 * 24 * 7; 

        return Jwts.builder()
            .subject(userEmail)
            .issuedAt(new Date(now))
            .expiration(new Date(expirationTime))
            .signWith(getSigningKey()) // This is your "NEW lock"
            .compact();
    }

    // --- 2. THE FIX (Helper) ---
    // We change the return type to the specific SecretKey
    private SecretKey getSigningKey() { 
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // --- METHODS TO READ/VALIDATE THE TOKEN ---

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

    // --- 3. THE FIX (The "Checker") ---
    // This "checker" now uses the NEW, correct "key"
    private Claims getAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey()) // This matches your ".signWith(getSigningKey())"
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}