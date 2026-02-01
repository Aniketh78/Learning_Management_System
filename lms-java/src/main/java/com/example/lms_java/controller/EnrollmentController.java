package com.example.lms_java.controller;

import com.example.lms_java.dto.AssignmentResponse;
import com.example.lms_java.dto.EnrollRequest;
import com.example.lms_java.dto.EnrollmentOptionResponse;
import com.example.lms_java.dto.MySubjectResponse;
import com.example.lms_java.entity.Assignment;
import com.example.lms_java.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/enroll")
@RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    @GetMapping("/options")
    public List<EnrollmentOptionResponse> options(){
        return enrollmentService.getOptions();
    }

    @PostMapping
    public void enroll(@RequestBody List<EnrollRequest> request){
        enrollmentService.enroll(request);
    }

    @GetMapping("/my-subjects")
    public List<MySubjectResponse> mySubjects(){
        return enrollmentService.getMySubjects();
    }
    @GetMapping("/my-assignments")
    public List<AssignmentResponse> myAssignments() {
        return enrollmentService.getMyAssignments();
    }
    @GetMapping("/subject/{subjectId}/assignments")
    public List<AssignmentResponse> assignmentsBySubject(@PathVariable Long subjectId) {
        return enrollmentService.getAssignmentsBySubject(subjectId);
    }

}
