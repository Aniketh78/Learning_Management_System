package com.example.lms_java.service;

import com.example.lms_java.dto.SubmissionResponse;
import com.example.lms_java.dto.SubmitAssignmentRequest;
import com.example.lms_java.entity.*;
import com.example.lms_java.repository.AssignmentRepository;
import com.example.lms_java.repository.StudentEnrollmentRepository;
import com.example.lms_java.repository.SubmissionRepository;
import com.example.lms_java.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Cache;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.security.authorization.AuthorityReactiveAuthorizationManager.hasRole;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    @CacheEvict(value = "assignmentSubmissions", key = "#request.assignmentId")
    public void submit(SubmitAssignmentRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User student = userRepository.findByEmail(email).orElseThrow();

        if (student.getRole() != Role.STUDENT)
            throw new RuntimeException("Only students can submit");

        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        StudentEnrollment enrollment = enrollmentRepository
                .findByStudentAndSubject(student, assignment.getSubject())
                .orElseThrow(() -> new RuntimeException("Not enrolled in subject"));

        if (!enrollment.getTeacher().getId().equals(assignment.getTeacher().getId()))
            throw new RuntimeException("Invalid assignment for student");

        if (submissionRepository.existsByAssignmentAndStudent(assignment, student))
            throw new RuntimeException("Already submitted");

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setContent(request.getContent());
        submission.setSubmittedAt(LocalDateTime.now());

        submissionRepository.save(submission);
    }
    @Cacheable(value = "assignmentSubmissions", key = "#assignmentId")
    @PreAuthorize("hasRole('TEACHER') && @assignmentSecurity.isOwner(#assignmentId, authentication.name)")
    public List<SubmissionResponse> getSubmissionsForAssignment(Long assignmentId) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        return submissionRepository.findByAssignment(assignment)
                .stream()
                .map(s -> new SubmissionResponse(
                        s.getId(),
                        s.getStudent().getName(),
                        s.getStudent().getEmail(),
                        s.getContent(),
                        s.getSubmittedAt()
                ))
                .toList();
    }
}
