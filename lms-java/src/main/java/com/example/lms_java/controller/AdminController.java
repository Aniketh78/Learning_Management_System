package com.example.lms_java.controller;

import com.example.lms_java.dto.CreateUserRequest;
import com.example.lms_java.dto.UserResponse;
import com.example.lms_java.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/teacher")
    public void createTeacher(@RequestBody CreateUserRequest createUserRequest){
        adminService.createTeacher(createUserRequest);
    }
    @PostMapping("/student")
    public void createStudent(@RequestBody CreateUserRequest request) {
        adminService.createStudent(request);
    }

    @GetMapping("/students")
    public List<UserResponse> getAllStudents() {
        return adminService.getAllStudents();
    }

    @GetMapping("/teachers")
    public List<UserResponse> getAllTeachers() {
        return adminService.getAllTeachers();
    }
}

