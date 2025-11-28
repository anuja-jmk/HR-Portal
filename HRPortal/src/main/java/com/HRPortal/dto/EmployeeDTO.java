package com.HRPortal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private int employee_id;
    private String first_name;
    private String last_name;
    private String email;
    private String title;
    private String photograph_path;
    private int department_id;
    private String department_name;
}
