package com.NoticeBoard.noticeboard.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration // 1. This is a "Factory" class
public class FirebaseConfig {

    // 2. This is the name of your "master key" file
    private final String FIREBASE_CONFIG_PATH = "noticeboard-4f684-firebase-adminsdk-fbsvc-73e28de118.json";

    @Bean // 3. This is the "Blueprint" for our tool
    public FirebaseApp firebaseApp() throws IOException {
        
        // 4. Find the "master key" file in our 'resources' folder
        ClassPathResource serviceAccount = new ClassPathResource(FIREBASE_CONFIG_PATH);

        // 5. Open the file
        InputStream serviceAccountStream = serviceAccount.getInputStream();

        // 6. Read the key
        FirebaseOptions options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
            .build();

        // 7. "Turn on" the Firebase "tool" and give it to Spring
        // We check if it's already initialized to prevent crashes on re-run
        if (FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.initializeApp(options);
        } else {
            return FirebaseApp.getInstance();
        }
    }
}