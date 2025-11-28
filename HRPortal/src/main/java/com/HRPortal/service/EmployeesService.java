package com.HRPortal.service;


import com.HRPortal.entity.Employees;
import com.HRPortal.entity.Department;
import com.HRPortal.repository.EmployeesRepo;
import com.HRPortal.repository.DepartmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmployeesService {
    @Autowired
    private EmployeesRepo employeesRepo;
    @Autowired
    private DepartmentRepo departmentRepo;

    public List<Employees> getAll() {
        return employeesRepo.findAll();
    }

    public String getDetails()
    {
        List<Employees> st =  employeesRepo.findAll();
        return st.toString();
    }
    public Employees getEmployeeByEmployee_id(int emp_id)
    {
        return employeesRepo.findById(emp_id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employees not found"));

    }
//    public List<Employees> getEmployeeByName(String name)
//    {
//        List<Employees> employees = employeesRepo.findByFirst_name(name);
//        if(employees.isEmpty())
//        {
//            throw new RuntimeException("Employees not found");
//        }
//        return employees;
//
//    }

    public Employees addEmployees(Employees employees)
    {
        Department dept = employees.getDepartment();
        if (dept != null && dept.getDepartmentId() != 0) {
            Department target = departmentRepo.findById((long)dept.getDepartmentId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
            if (target.getSeats_left() != null && target.getSeats_left() == 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "No seats left in the selected department");
            }
            employees.setDepartment(target);
        }
        return employeesRepo.save(employees);
    }
    public Employees updateEmployees(int emp_id, Employees employees){
//        Employees up_st = studentRepo.findById(roll).orElseThrow(() -> new RuntimeException("Employees not found"));
//        up_st.setName(employees.getName());
//        up_st.setRoll(employees.getRoll());

        return employeesRepo.findById(emp_id).map(st -> {
            Department dept = employees.getDepartment();
            if (dept != null && dept.getDepartmentId() != 0) {
                Department target = departmentRepo.findById((long)dept.getDepartmentId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
                if (target.getSeats_left() != null && target.getSeats_left() == 0) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "No seats left in the selected department");
                }
                st.setDepartment(target);
            }
            st.setFirst_name(employees.getFirst_name());
            st.setLast_name(employees.getLast_name());
            st.setEmail(employees.getEmail());
            st.setTitle(employees.getTitle());
            st.setPhotograph_path(employees.getPhotograph_path());
            return employeesRepo.save(st);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employees not found"));
    }
    public String deleteEmployees(int emp_id){
        return employeesRepo.findById(emp_id).map(st -> {
            employeesRepo.delete(st);
            return st.toString();
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employees not found"));
    }
}
