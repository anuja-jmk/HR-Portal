package com.HRPortal.repository;

import com.HRPortal.entity.Employees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeesRepo extends JpaRepository<Employees, Integer> {
//    List<Employees> findByFirst_name(String first_name);
//    List<Employees> findByLast_name(String first_name);

}
