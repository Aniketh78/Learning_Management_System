package com.example.lms_java.service;

import com.example.lms_java.dto.SubmissionResponse;
import com.example.lms_java.dto.SubmitAssignmentRequest;
import com.example.lms_java.entity.*;
import com.example.lms_java.repository.AssignmentRepository;
import com.example.lms_java.repository.StudentEnrollmentRepository;
import com.example.lms_java.repository.SubmissionRepository;
import com.example.lms_java.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

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
    public List<SubmissionResponse> getSubmissionsForAssignment(Long assignmentId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User teacher = userRepository.findByEmail(email).orElseThrow();

        if (teacher.getRole() != Role.TEACHER)
            throw new RuntimeException("Only teachers can view submissions");

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // ensure this teacher owns the assignment
        if (!assignment.getTeacher().getId().equals(teacher.getId()))
            throw new RuntimeException("You do not own this assignment");

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
