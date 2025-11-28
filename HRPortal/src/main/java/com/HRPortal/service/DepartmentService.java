package com.HRPortal.service;


import com.HRPortal.entity.Department;
import com.HRPortal.entity.Employees;
import com.HRPortal.repository.DepartmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {
    @Autowired
    private DepartmentRepo repo;
    public String getDetails()
    {
        List<Department> st =  repo.findAll();
        return st.toString();
    }
    public Department getDepartmentByDepartment_id(long dept_id)
    {
        return repo.findById(dept_id).orElseThrow(() -> new RuntimeException("Department not found"));

    }
}
