package com.example.lms_java.controller;

import com.example.lms_java.dto.CreateSubjectRequest;
import com.example.lms_java.dto.SubjectResponse;
import com.example.lms_java.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public String create(@RequestBody CreateSubjectRequest request) {
        return subjectService.createSubject(request);
    }

    @GetMapping
    public List<SubjectResponse> getAllSubjects() {
        return subjectService.getAllSubjects();
    }
}
