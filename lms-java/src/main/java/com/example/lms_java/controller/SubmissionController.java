package com.example.lms_java.controller;

import com.example.lms_java.dto.SubmissionResponse;
import com.example.lms_java.dto.SubmitAssignmentRequest;
import com.example.lms_java.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    public void submit(@RequestBody SubmitAssignmentRequest request) {
        submissionService.submit(request);
    }

}