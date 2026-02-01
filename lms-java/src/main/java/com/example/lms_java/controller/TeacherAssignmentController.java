package com.example.lms_java.controller;


import com.example.lms_java.dto.CreateAssignmentRequest;
import com.example.lms_java.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/assignments")
@RequiredArgsConstructor
public class TeacherAssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public void create(@RequestBody CreateAssignmentRequest request) {
        assignmentService.createAssignment(request);
    }
}