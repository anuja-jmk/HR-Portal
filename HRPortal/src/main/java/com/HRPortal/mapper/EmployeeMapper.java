package com.HRPortal.mapper;

import com.HRPortal.dto.EmployeeDTO;
import com.HRPortal.entity.Department;
import com.HRPortal.entity.Employees;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeDTO toDTO(Employees employee) {
        if (employee == null) {
            return null;
        }

        EmployeeDTO dto = new EmployeeDTO();
        dto.setEmployee_id(employee.getEmployee_id());
        dto.setFirst_name(employee.getFirst_name());
        dto.setLast_name(employee.getLast_name());
        dto.setEmail(employee.getEmail());
        dto.setTitle(employee.getTitle());
        dto.setPhotograph_path(employee.getPhotograph_path());
        
        if (employee.getDepartment() != null) {
            dto.setDepartment_id(employee.getDepartment().getDepartmentId());
            dto.setDepartment_name(employee.getDepartment().getName());
        }
        
        return dto;
    }

    public Employees toEntity(EmployeeDTO dto) {
        if (dto == null) {
            return null;
        }

        Employees employee = new Employees();
        return updateEntity(employee, dto);
    }

    public Employees updateEntity(Employees employee, EmployeeDTO dto) {
        if (dto == null) {
            return employee;
        }
        
        System.out.println("In updateEntity, DTO department_id: " + dto.getDepartment_id());

        if (dto.getFirst_name() != null) {
            employee.setFirst_name(dto.getFirst_name());
        }
        
        // Set department if department_id is provided (0 means no department)
        if (dto.getDepartment_id() != 0) {
            System.out.println("Creating department with ID: " + dto.getDepartment_id());
            Department department = new Department();
            department.setDepartmentId(dto.getDepartment_id());
            employee.setDepartment(department);
            System.out.println("Employee department after setting: " + employee.getDepartment());
        }
        
        if (dto.getLast_name() != null) {
            employee.setLast_name(dto.getLast_name());
        }
        if (dto.getEmail() != null) {
            employee.setEmail(dto.getEmail());
        }
        if (dto.getTitle() != null) {
            employee.setTitle(dto.getTitle());
        }
        if (dto.getPhotograph_path() != null) {
            employee.setPhotograph_path(dto.getPhotograph_path());
        }

        return employee;
    }
}
