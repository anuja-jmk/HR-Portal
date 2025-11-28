package com.HRPortal.controller;


import com.HRPortal.repository.DepartmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.HRPortal.dto.DepartmentNameDTO;
import com.HRPortal.dto.DepartmentSeatsDTO;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/department")
public class DepartmentController {
 
    @Autowired
    private DepartmentRepo departmentRepo;

    @GetMapping("/seats-left")
    public List<DepartmentSeatsDTO> getDepartmentsWithSeatsLeft() {
        return departmentRepo.findAll().stream()
                .map(d -> new DepartmentSeatsDTO(
                    d.getDepartmentId(),
                    d.getName(), 
                    d.getSeats_left()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/names")
    public List<DepartmentNameDTO> getDepartmentNames() {
        return departmentRepo.findAll().stream()
                .map(d -> new DepartmentNameDTO(d.getDepartmentId(), d.getName()))
                .collect(Collectors.toList());
    }
}
