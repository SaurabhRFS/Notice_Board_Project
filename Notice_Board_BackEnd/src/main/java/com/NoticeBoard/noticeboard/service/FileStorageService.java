package com.NoticeBoard.noticeboard.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils; // Import this utility
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
// import com.cloudinary.utils.ObjectUtils; // Make sure this is imported

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
        String originalFilename = file.getOriginalFilename();
        String contentType = file.getContentType();
        
        // Default: Assume it's a Raw file (safe fallback)
        String resourceType = "raw"; 

        // --- SMART DETECTION ---
        
        // CASE 1: IMAGES & VIDEOS -> Use "auto"
        // Cloudinary is great at handling these. It will auto-detect format and extension.
        if (contentType != null && (contentType.startsWith("image/") || contentType.startsWith("video/"))) {
            resourceType = "auto";
            // We DO NOT append the extension here. Cloudinary does it for us.
        } 
        
        // CASE 2: PDFs & DOCS -> Force "raw" + Manual Extension
        // We handle these manually to ensure they download correctly and aren't corrupted.
        else {
            resourceType = "raw";
            if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                publicId = publicId + extension;
            }
        }

        Map params = ObjectUtils.asMap(
            "public_id", publicId,
            "resource_type", resourceType
        );

        // Standard upload is fine for <10MB files
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

        return (String) uploadResult.get("secure_url");
    }


    


    // public String uploadFile(MultipartFile file) throws IOException {
        
    //     // 1. Simple UUID (No extension logic, to avoid "double extension" errors)
    //     String publicId = UUID.randomUUID().toString();
        
    //     // 2. Force Raw (To ensure it uploads without "Image" errors)
    //     Map params = ObjectUtils.asMap(
    //         "public_id", publicId,
    //         "resource_type", "raw" 
    //     );

    //     // 3. Standard Upload
    //     Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

    //     return (String) uploadResult.get("secure_url");
    // }


    // --- OLD CODE (BEFORE THE FIX) ---
    // public String uploadFile(MultipartFile file) throws IOException {
        
    //     String publicId = UUID.randomUUID().toString();
    //     String originalFilename = file.getOriginalFilename();
    //     String contentType = file.getContentType();
        
    //     // Default to "auto" for Images/Videos (Cloudinary handles these well)
    //     String resourceType = "auto"; 

    //     // --- THE CRITICAL FIX FOR PDFS ---
    //     // 1. Force "raw" for PDFs. This prevents Cloudinary from processing/corrupting them.
    //     if (contentType != null && (
    //            contentType.equals("application/pdf") 
    //         || contentType.contains("msword") 
    //         || contentType.contains("document")
    //         || contentType.contains("zip"))) {
            
    //         resourceType = "raw";
            
    //         // 2. MANUALLY APPEND EXTENSION
    //         // For "raw" files, we MUST add the extension to the ID, 
    //         // otherwise Cloudinary saves it with no extension (leading to the "Chinese Text" issue).
    //         if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
    //             String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
    //             publicId = publicId + extension;
    //         }
    //     }

    //     Map params = ObjectUtils.asMap(
    //         "public_id", publicId,
    //         "resource_type", resourceType
    //     );

    //     // 3. Use standard 'upload' (NOT uploadLarge)
    //     // This is the most stable method for files under 10MB.
    //     Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

    //     return (String) uploadResult.get("secure_url");
    // }

}

