package com.example.lms_java.controller;

import com.example.lms_java.dto.SubmissionResponse;
import com.example.lms_java.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/submissions")
@RequiredArgsConstructor
public class TeacherSubmissionController {

    private final SubmissionService submissionService;

    @GetMapping("/assignment/{assignmentId}")
    public List<SubmissionResponse> submissions(@PathVariable Long assignmentId) {
        return submissionService.getSubmissionsForAssignment(assignmentId);
    }
}
