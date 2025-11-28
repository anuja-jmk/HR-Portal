package com.HRPortal.helper;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@Component
public class FileHelper {
    
    private String uploadDir;
    private String employeePhotosDir;
    
    @Value("${file.upload-dir}")
    private String baseUploadDir;
    
    @Value("${file.employee-photos-dir}")
    private String configuredEmployeePhotosDir;
    
    @PostConstruct
    public void init() {
        try {
            // Normalize paths and ensure they end with a slash
            this.uploadDir = baseUploadDir.endsWith("/") ? baseUploadDir : baseUploadDir + "/";
            this.employeePhotosDir = configuredEmployeePhotosDir.endsWith("/") ? 
                configuredEmployeePhotosDir : configuredEmployeePhotosDir + "/";
                
            // Create directories if they don't exist
            Path uploadPath = Paths.get(this.employeePhotosDir);
            Files.createDirectories(uploadPath);
            
            // Check directory permissions
            if (!Files.isWritable(uploadPath)) {
                throw new RuntimeException("Upload directory is not writable: " + uploadPath.toAbsolutePath());
            }
            
            // Log the directories being used (for debugging)
            System.out.println("Base upload directory: " + this.uploadDir);
            System.out.println("Employee photos directory: " + this.employeePhotosDir);
            System.out.println("Absolute path: " + uploadPath.toAbsolutePath());
            
            // List files in the directory (for debugging)
            try {
                System.out.println("Files in upload directory:");
                Files.list(uploadPath).forEach(path -> System.out.println("  - " + path));
            } catch (Exception e) {
                System.out.println("Could not list files in upload directory: " + e.getMessage());
            }
        } catch (IOException e) {
            System.err.println("ERROR: Could not create upload directories: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Could not create upload directories: " + e.getMessage(), e);
        }
    }
    
    public String saveFile(MultipartFile file, String fileName) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        // Get the file extension
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        // Sanitize the filename
        String safeFileName = fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
        String newFileName = safeFileName + fileExtension;
        
        // Create the target file
        Path targetLocation = Paths.get(employeePhotosDir).resolve(newFileName);
        
        // Ensure the upload directory exists
        Files.createDirectories(targetLocation.getParent());
        
        // Save the file
        file.transferTo(targetLocation);
        
        // Return the relative path that can be used in URLs
        return "/uploads/employee_photos/" + newFileName;
    }
    
    public Resource loadFileAsResource(String fileName) throws IOException {
        try {
            // Handle different path formats
            String relativePath = fileName;
            
            // Remove leading ./ if present
            if (relativePath.startsWith("./")) {
                relativePath = relativePath.substring(2);
            }
            // Remove leading /uploads/ if present
            else if (relativePath.startsWith("/uploads/")) {
                relativePath = relativePath.substring("/uploads/".length());
            }
            // Handle paths that start with /photos/
            else if (relativePath.startsWith("/photos/")) {
                relativePath = relativePath.substring(1); // Remove the leading slash
            }
            
            // Get the base directory (either from employeePhotosDir or uploadDir)
            String baseDir = employeePhotosDir != null ? employeePhotosDir : uploadDir;
            
            // Resolve the full path
            Path filePath = Paths.get(baseDir).resolve(relativePath).normalize();
            
            // Security check: ensure the file is within the intended directory
            Path basePath = Paths.get(baseDir).normalize();
            if (!filePath.startsWith(basePath)) {
                throw new IOException("Access denied: Path traversal attempt detected");
            }
            
            System.out.println("[DEBUG] Loading file from: " + filePath);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                System.out.println("[DEBUG] File does not exist at: " + filePath);
                throw new IOException("File not found: " + filePath);
            }
            
            if (!resource.isReadable()) {
                System.out.println("[DEBUG] File exists but is not readable: " + filePath);
                throw new IOException("File is not readable: " + filePath);
            }
            
            return resource;
        } catch (Exception ex) {
            System.out.println("[ERROR] Error loading file: " + fileName + " - " + ex.getMessage());
            throw new IOException("Error loading file: " + fileName, ex);
        }
    }
    
    public boolean deleteFile(String fileName) throws IOException {
        if (fileName == null || fileName.isEmpty()) {
            return false;
        }
        
        try {
            // Handle different path formats
            String relativePath = fileName;
            
            // Remove leading ./ if present
            if (relativePath.startsWith("./")) {
                relativePath = relativePath.substring(2);
            }
            // Remove leading /uploads/ if present
            else if (relativePath.startsWith("/uploads/")) {
                relativePath = relativePath.substring("/uploads/".length());
            }
            
            // Get the base directory (either from employeePhotosDir or uploadDir)
            String baseDir = employeePhotosDir != null ? employeePhotosDir : uploadDir;
            
            // Resolve the full path
            Path filePath = Paths.get(baseDir).resolve(relativePath).normalize();
            
            // Security check: ensure the file is within the intended directory
            Path basePath = Paths.get(baseDir).normalize();
            if (!filePath.startsWith(basePath)) {
                throw new IOException("Access denied: Path traversal attempt detected");
            }
            
            System.out.println("[DEBUG] Deleting file at: " + filePath);
            boolean deleted = Files.deleteIfExists(filePath);
            
            if (!deleted) {
                System.out.println("[DEBUG] File did not exist, nothing to delete: " + filePath);
            }
            
            return deleted;
        } catch (Exception ex) {
            System.out.println("[ERROR] Error deleting file: " + fileName + " - " + ex.getMessage());
            throw new IOException("Could not delete file: " + fileName, ex);
        }
    }
    
    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        return lastDotIndex == -1 ? "" : fileName.substring(lastDotIndex + 1);
    }
}
