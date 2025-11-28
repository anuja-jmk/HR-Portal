package com.HRPortal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    private Long department_id;
    private String name;
    private Integer capacity;
    private Integer seats_left;
}
