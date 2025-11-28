package com.HRPortal.util;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class FileStorageUtil {
    private static final String UPLOAD_DIR = "./uploads/employee_photos/";

    public static String storeFile(MultipartFile file, int employeeId) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Get file extension
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        // Create new file name with employee ID
        String newFileName = "emp_" + employeeId + fileExtension;
        Path targetLocation = uploadPath.resolve(newFileName);
        
        // Save the file
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Return the relative path
        return UPLOAD_DIR + newFileName;
    }

    public static void deleteFile(String filePath) throws IOException {
        if (filePath != null && !filePath.isEmpty()) {
            Path fileToDelete = Paths.get(filePath);
            if (Files.exists(fileToDelete)) {
                Files.delete(fileToDelete);
            }
        }
    }
}
