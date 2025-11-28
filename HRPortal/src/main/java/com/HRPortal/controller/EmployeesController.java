package com.HRPortal.controller;

import com.HRPortal.dto.ApiMessageDTO;
import com.HRPortal.dto.EmployeeDTO;
import com.HRPortal.entity.Department;
import com.HRPortal.entity.Employees;
import com.HRPortal.helper.FileHelper;
import com.HRPortal.service.EmployeesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employee")
public class EmployeesController {

    private final EmployeesService service;
    private final FileHelper fileHelper;
    
    @Autowired
    public EmployeesController(EmployeesService service, FileHelper fileHelper) {
        this.service = service;
        this.fileHelper = fileHelper;
    }

    @GetMapping("/get")
    public ResponseEntity<List<EmployeeDTO>> getEmployees() {
        List<Employees> list = service.getAll();
        List<EmployeeDTO> dtos = list.stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/get-by-id/{emp_id}")
    public ResponseEntity<EmployeeDTO> getEmployeeByEmployee_id(@PathVariable int emp_id){
        Employees e = service.getEmployeeByEmployee_id(emp_id);
        return ResponseEntity.ok(toDTO(e));
    }

    @PostMapping(value = "/add", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<EmployeeDTO> addEmployee(
            @RequestParam("first_name") String firstName,
            @RequestParam("last_name") String lastName,
            @RequestParam("email") String email,
            @RequestParam("title") String title,
            @RequestParam(value = "photograph", required = false) MultipartFile photograph,
            @RequestParam(value = "departmentId", required = false, defaultValue = "0") int departmentId) throws IOException {
            
        Employees employee = new Employees();
        employee.setFirst_name(firstName);
        employee.setLast_name(lastName);
        employee.setEmail(email);
        employee.setTitle(title);
        
        if (departmentId != 0) {
            Department department = new Department();
            department.setDepartmentId(departmentId);
            employee.setDepartment(department);
        }
        
        Employees savedEmployee = service.addEmployees(employee);
        
        // Save the photograph after we have the employee ID
        if (photograph != null && !photograph.isEmpty()) {
            try {
                String fileName = "emp_" + savedEmployee.getEmployee_id();
                String photoPath = fileHelper.saveFile(photograph, fileName);
                // Update the employee with the new photo path
                savedEmployee.setPhotograph_path(photoPath);
                savedEmployee = service.updateEmployees(savedEmployee.getEmployee_id(), savedEmployee);
            } catch (IOException e) {
                System.err.println("Error saving employee photo: " + e.getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(savedEmployee));
    }

    @PutMapping(value = "/update/{emp_id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable int emp_id,
            @RequestParam("first_name") String firstName,
            @RequestParam("last_name") String lastName,
            @RequestParam("email") String email,
            @RequestParam("title") String title,
            @RequestParam(value = "photograph", required = false) MultipartFile photograph,
            @RequestParam(value = "departmentId", required = false, defaultValue = "0") int departmentId) throws IOException {
            
        Employees employee = new Employees();
        employee.setFirst_name(firstName);
        employee.setLast_name(lastName);
        employee.setEmail(email);
        employee.setTitle(title);
        
        if (departmentId != 0) {
            Department department = new Department();
            department.setDepartmentId(departmentId);
            employee.setDepartment(department);
        }
        
        // First, get the existing employee to check for an existing photo
        Employees existingEmployee = service.getEmployeeByEmployee_id(emp_id);
        
        if (photograph != null && !photograph.isEmpty()) {
            try {
                // First, delete the old photo if it exists
                if (existingEmployee != null && existingEmployee.getPhotograph_path() != null) {
                    try {
                        String oldPhotoPath = existingEmployee.getPhotograph_path();
                        // Extract just the filename from the old path
                        if (oldPhotoPath != null) {
                            if (oldPhotoPath.startsWith("/uploads/employee_photos/")) {
                                oldPhotoPath = oldPhotoPath.substring("/uploads/employee_photos/".length());
                            } else if (oldPhotoPath.startsWith("uploads/employee_photos/")) {
                                oldPhotoPath = oldPhotoPath.substring("uploads/employee_photos/".length());
                            }
                            fileHelper.deleteFile(oldPhotoPath);
                        }
                    } catch (Exception e) {
                        System.err.println("Error deleting old employee photo: " + e.getMessage());
                        // Continue with saving the new photo even if deleting old one fails
                    }
                }
                
                // Save the new photo with consistent naming
                String fileName = "emp_" + emp_id;
                String photoPath = fileHelper.saveFile(photograph, fileName);
                employee.setPhotograph_path(photoPath);
                System.out.println("Updated photo path for employee " + emp_id + " to: " + photoPath);
            } catch (IOException e) {
                System.err.println("Error updating employee photo: " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating employee photo", e);
            }
        } else if (existingEmployee != null && photograph == null) {
            // If no new photo is provided, keep the existing photo path
            employee.setPhotograph_path(existingEmployee.getPhotograph_path());
        } else {
            // If photograph is explicitly set to empty, set to null
            employee.setPhotograph_path(null);
        }
        
        Employees updatedEmployee = service.updateEmployees(emp_id, employee);
        return ResponseEntity.ok(toDTO(updatedEmployee));
    }
    
    @DeleteMapping("/delete/{emp_id}")
    public ResponseEntity<ApiMessageDTO> deleteEmployee(@PathVariable int emp_id){
        service.deleteEmployees(emp_id);
        return ResponseEntity.ok(new ApiMessageDTO("Deleted"));
    }

    @GetMapping("/image/{emp_id}")
    public ResponseEntity<Resource> getEmployeeImage(@PathVariable int emp_id) {
        try {
            System.out.println("[DEBUG] Getting image for employee ID: " + emp_id);
            Employees employee = service.getEmployeeByEmployee_id(emp_id);
            
            if (employee == null) {
                System.out.println("[ERROR] Employee " + emp_id + " not found in database");
                return ResponseEntity.noContent().build();
            }
            
            if (employee.getPhotograph_path() == null || employee.getPhotograph_path().isEmpty()) {
                System.out.println("[ERROR] Employee " + emp_id + " has no photo path in database");
                return ResponseEntity.noContent().build();
            }
            
            // Get the path from the database and clean it up
            String photoPath = employee.getPhotograph_path();
            System.out.println("[DEBUG] Photo path from database: " + photoPath);
            
            // Extract just the filename from the path
            String filename = photoPath;
            if (filename != null) {
                // Remove the leading part of the path that's added by saveFile
                if (filename.startsWith("/uploads/employee_photos/")) {
                    filename = filename.substring("/uploads/employee_photos/".length());
                } else if (filename.startsWith("uploads/employee_photos/")) {
                    filename = filename.substring("uploads/employee_photos/".length());
                } else if (filename.startsWith("/photos/")) {
                    // Keep as is, FileHelper will handle it
                    System.out.println("[DEBUG] Using photo path with /photos/ prefix: " + filename);
                } else {
                    System.out.println("[DEBUG] Photo path doesn't start with expected prefix, using as-is: " + filename);
                }
            } else {
                System.out.println("[ERROR] Photo path is null for employee " + emp_id);
                return ResponseEntity.noContent().build();
            }
            
            System.out.println("[DEBUG] Attempting to load file: " + filename);
            try {
                Resource resource = fileHelper.loadFileAsResource(filename);
                System.out.println("[DEBUG] Resource loaded: " + resource);
                
                if (!resource.exists()) {
                    System.out.println("[ERROR] Resource does not exist: " + resource.getURL());
                    return ResponseEntity.noContent().build();
                }
                
                if (!resource.isReadable()) {
                    System.out.println("[ERROR] Resource exists but is not readable: " + resource.getURL());
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
                
                // Determine content type based on file extension
                MediaType contentType;
                String lowerFilename = filename.toLowerCase();
                if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
                    contentType = MediaType.IMAGE_JPEG;
                } else if (lowerFilename.endsWith(".png")) {
                    contentType = MediaType.IMAGE_PNG;
                } else if (lowerFilename.endsWith(".gif")) {
                    contentType = MediaType.IMAGE_GIF;
                } else {
                    contentType = MediaType.APPLICATION_OCTET_STREAM;
                }
                
                return ResponseEntity.ok()
                        .contentType(contentType)
                        .body(resource);
                        
            } catch (Exception e) {
                System.err.println("Error loading image for employee " + emp_id + ": " + e.getMessage());
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            System.err.println("Unexpected error for employee " + emp_id + ": " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private EmployeeDTO toDTO(Employees e) {
        int deptId = e.getDepartment() != null ? e.getDepartment().getDepartmentId() : 0;
        String deptName = e.getDepartment() != null ? e.getDepartment().getName() : null;
        return new EmployeeDTO(
                e.getEmployee_id(),
                e.getFirst_name(),
                e.getLast_name(),
                e.getEmail(),
                e.getTitle(),
                e.getPhotograph_path(),
                deptId,
                deptName
        );
    }

}
