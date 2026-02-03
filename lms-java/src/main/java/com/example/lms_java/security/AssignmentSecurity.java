package com.example.lms_java.security;

import com.example.lms_java.entity.Assignment;
import com.example.lms_java.entity.User;
import com.example.lms_java.repository.AssignmentRepository;
import com.example.lms_java.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component("assignmentSecurity")
public class AssignmentSecurity {
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public AssignmentSecurity(
            AssignmentRepository assignmentRepository,
            UserRepository userRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    public boolean isOwner(Long assignmentId, String email) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return assignment.getTeacher().getId().equals(teacher.getId());
    }
}
