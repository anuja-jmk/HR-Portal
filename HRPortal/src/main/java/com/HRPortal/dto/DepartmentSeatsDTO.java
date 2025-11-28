package com.HRPortal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentSeatsDTO {
    private int departmentId;
    private String name;
    private Integer seats_left;
}
