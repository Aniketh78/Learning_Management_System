package com.example.lms_java.service;

import com.example.lms_java.dto.CreateAssignmentRequest;
import com.example.lms_java.entity.Assignment;
import com.example.lms_java.entity.Role;
import com.example.lms_java.entity.Subject;
import com.example.lms_java.entity.User;
import com.example.lms_java.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;

    public void createAssignment(CreateAssignmentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(teacher.getRole()!= Role.TEACHER){
            throw new RuntimeException("User is not a teacher");
        }
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if(!teacherSubjectRepository.existsByTeacherIdAndSubjectId(teacher.getId(), request.getSubjectId())){
            throw new RuntimeException("Teacher is not assigned to this subject");
        }

        Assignment assignment = new Assignment();
        assignment.setTeacher(teacher);
        assignment.setSubject(subject);
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDueDate(request.getDueDate());

        assignmentRepository.save(assignment);
    }
}
