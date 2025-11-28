package com.mycompany.myapp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.io.IOException;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public ImageUploadService(
        @Value("${cloudinary.cloud_name}") String cloudName,
        @Value("${cloudinary.api_key}") String apiKey,
        @Value("${cloudinary.api_secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(Map.of("cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret));
    }

    public String upload(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary
            .uploader()
            .upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder",
                    "product_images" // dossier dans Cloudinary
                )
            );

        return uploadResult.get("secure_url").toString();
    }
}
