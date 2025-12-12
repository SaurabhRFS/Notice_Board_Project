package com.NoticeBoard.noticeboard.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
        
        String resourceType = "raw"; 

        if (contentType != null && (contentType.startsWith("image/") || contentType.startsWith("video/"))) {
            resourceType = "auto";
        } else {
            resourceType = "raw";
            if (originalFilename != null && originalFilename.lastIndexOf(".") > 0) {
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                publicId = publicId + extension;
            }
        }

        // FIX 1: Add <String, Object> generic types
        // We suppress "unchecked" because Cloudinary's library returns a raw Map
        @SuppressWarnings("unchecked")
        Map<String, Object> params = ObjectUtils.asMap(
            "public_id", publicId,
            "resource_type", resourceType
        );

        // FIX 2: Add <String, Object> generic types here too
        @SuppressWarnings("unchecked")
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

        return (String) uploadResult.get("secure_url");
    }
}