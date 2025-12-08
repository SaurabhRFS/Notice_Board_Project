package com.NoticeBoard.noticeboard.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // This is still our "Factory"
public class CloudinaryConfig {

    // 1. Inject the one new "master key"
    @Value("${cloudinary.url}")
    private String cloudinaryUrl;

    @Bean // This is still our "Blueprint"
    public Cloudinary cloudinary() {

        // 2. Build the "tool" using the single URL.
        // This is much cleaner and less error-prone.
        return new Cloudinary(cloudinaryUrl);
    }
}