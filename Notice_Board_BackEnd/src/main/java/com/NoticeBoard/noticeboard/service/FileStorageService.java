package com.NoticeBoard.noticeboard.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils; // Import this utility
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.utils.ObjectUtils; // Make sure this is imported

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private final Cloudinary cloudinary;

    public FileStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }




    public String uploadFile(MultipartFile file) throws IOException {
        String publicId = UUID.randomUUID().toString();
        
        // 1. Determine Content Type
        String contentType = file.getContentType();
        String resourceType = "auto"; 

        // 2. FORCE "raw" for PDFs/Docs to ensure they are downloadable
        if (contentType != null && (contentType.equals("application/pdf") 
            || contentType.contains("document") 
            || contentType.contains("msword") 
            || contentType.contains("zip"))) {
            resourceType = "raw";
        }

        // 3. Configure parameters
        Map params = ObjectUtils.asMap(
            "public_id", publicId,
            "resource_type", resourceType
        );

        // --- THE FIX: Use 'uploadLarge' and 'getInputStream' ---
        // 'uploadLarge' handles chunking automatically for files > 10MB.
        // 'getInputStream()' streams data instead of loading 25MB into RAM at once.
        Map uploadResult = cloudinary.uploader().uploadLarge(file.getInputStream(), params);

        return (String) uploadResult.get("secure_url");
    }



}

