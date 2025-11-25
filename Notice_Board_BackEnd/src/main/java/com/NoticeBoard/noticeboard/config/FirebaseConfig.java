package com.NoticeBoard.noticeboard.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    // This tells Spring: "Get the JSON string from the environment variable"
    @Value("${firebase.credentials.json}")
    private String firebaseJson;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        // Convert the JSON string into a stream that Firebase understands
        InputStream serviceAccountStream = new ByteArrayInputStream(firebaseJson.getBytes(StandardCharsets.UTF_8));

        FirebaseOptions options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
            .build();

        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        } else {
            return FirebaseApp.getInstance();
        }
    }
}