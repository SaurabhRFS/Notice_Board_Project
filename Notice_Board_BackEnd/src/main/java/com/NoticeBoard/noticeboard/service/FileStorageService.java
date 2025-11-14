package com.NoticeBoard.noticeboard.service;

import com.cloudinary.Cloudinary; // <-- Import the "tool"
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile; // <-- Import the "package"
import java.io.IOException; // <-- Import this for error handling
import java.util.Map; // <-- Import this
import java.util.UUID; // <-- Import this for unique names

@Service
public class FileStorageService {
    
    // 1. Create a private, final "box" to hold our tool
    private final Cloudinary cloudinary;

    // 2. This is the constructor
    // We "ask" Spring for the Cloudinary tool
    public FileStorageService(Cloudinary cloudinary) {
        // 3. Spring "injects" the tool, and we save it in our "box"
        this.cloudinary = cloudinary;
    }

    // This is our main "upload" method
    public String uploadFile(MultipartFile file) throws IOException {
        
        // --- Step 1: Create a unique, random filename ---
        // We can't use the user's name (e.g., "image.jpg")
        // because two users might upload a file with the same name!
        String publicId = UUID.randomUUID().toString();
        
        // --- Step 2: Upload the file ---
        // We call our "tool's" uploader
        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(), // This gets the actual file data (the "package contents")
            Map.of("public_id", publicId) // This tells Cloudinary to use our unique name
        );

        // --- Step 3: Get the new URL ---
        // The uploadResult is a "receipt" from Cloudinary.
        // We just want the "secure_url" (the https link) from it.
        return uploadResult.get("secure_url").toString();
    }
}
