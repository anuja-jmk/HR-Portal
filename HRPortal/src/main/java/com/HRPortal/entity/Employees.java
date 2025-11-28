package com.HRPortal.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
public class Employees {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int employee_id;
    private String first_name;
    private String last_name;
    @Column(nullable = false,unique=true)
    private String email;
    private String title;
    @Column(length = 500)
    private String photograph_path;
    @ManyToOne
    @JoinColumn(name = "department_id")
    @ToString.Exclude
    private Department department;

}
