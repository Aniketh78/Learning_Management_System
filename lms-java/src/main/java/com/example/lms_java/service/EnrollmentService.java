package com.example.lms_java.service;

import com.example.lms_java.dto.AssignmentResponse;
import com.example.lms_java.dto.EnrollRequest;
import com.example.lms_java.dto.EnrollmentOptionResponse;
import com.example.lms_java.dto.MySubjectResponse;
import com.example.lms_java.entity.*;
import com.example.lms_java.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.spel.ast.Assign;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final SubjectRepository subjectRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final UserRepository userRepository;
    private final StudentEnrollmentRepository studentEnrollmentRepository;
    private final AssignmentRepository assignmentRepository;

    public List<EnrollmentOptionResponse> getOptions(){
        List<Subject> subjects = subjectRepository.findAll();
        List<EnrollmentOptionResponse> result = new ArrayList<>();

        for(Subject subject: subjects){
            List<TeacherSubject> mapping =
                    teacherSubjectRepository.findBySubjectId(subject.getId());

            List<EnrollmentOptionResponse.TeacherOption> teachers = new ArrayList<>();

            for(TeacherSubject teacherSubject: mapping){
                User teacher = userRepository.findById(teacherSubject.getTeacherId()).get();
                teachers.add(
                        new EnrollmentOptionResponse.TeacherOption(
                                teacher.getId(), teacher.getName()
                        )
                );
            }

            result.add(new EnrollmentOptionResponse(subject.getId(), subject.getName(), teachers));

        }
        return result;
    }

    public void enroll(List<EnrollRequest> requests){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(student.getRole()!= Role.STUDENT){
            throw new RuntimeException("Only students can enroll");
        }

        for(EnrollRequest request: requests){
            Subject subject = subjectRepository.findById(request.getSubjectId()).
                    orElseThrow(() -> new RuntimeException("Subject not found"));

            User teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));

            if(teacher.getRole()!= Role.TEACHER){
                throw new RuntimeException("User is not a teacher");
            }

            if(!teacherSubjectRepository.existsByTeacherIdAndSubjectId(teacher.getId(), subject.getId())){
                throw new RuntimeException("Teacher is not assigned to this subject");
            }

            if(studentEnrollmentRepository.existsByStudentAndSubjectId(student, subject.getId())){
                throw new RuntimeException("User is already enrolled");

            }

            StudentEnrollment studentEnrollment = new StudentEnrollment();
            studentEnrollment.setStudent(student);
            studentEnrollment.setTeacher(teacher);
            studentEnrollment.setSubject(subject);
            studentEnrollmentRepository.save(studentEnrollment);
        }
    }
    public List<MySubjectResponse> getMySubjects(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        List<StudentEnrollment> studentEnrollments = studentEnrollmentRepository.findByStudent(student);

        return studentEnrollments.stream()
                .map(e-> new MySubjectResponse(
                        e.getSubject().getId(),
                        e.getSubject().getName(),
                        e.getSubject().getCode(),
                        e.getTeacher().getName()
                )).toList();


    }

    public List<AssignmentResponse> getMyAssignments(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<StudentEnrollment> enrollments = studentEnrollmentRepository.findByStudent(student);

        List<Subject> subjects = enrollments.stream()
                .map(StudentEnrollment::getSubject)
                .toList();

        return assignmentRepository.findBySubjectIn(subjects)
                .stream()
                .map(a -> new AssignmentResponse(
                        a.getId(),
                        a.getTitle(),
                        a.getDescription(),
                        a.getDueDate(),
                        a.getSubject().getName(),
                        a.getTeacher().getName()
                ))
                .toList();
    }

    public List<AssignmentResponse> getAssignmentsBySubject(Long subjectId){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subject subject = subjectRepository.findById(subjectId).orElseThrow(() -> new RuntimeException("Subject not found"));

        StudentEnrollment enrollment = studentEnrollmentRepository.findByStudentAndSubject(student, subject)
                .orElseThrow(() -> new RuntimeException("Student is not enrolled in this subject"));

        return assignmentRepository.findBySubjectAndTeacher(subject, enrollment.getTeacher()).stream()
                .map(a -> new AssignmentResponse(
                        a.getId(),
                        a.getTitle(),
                        a.getDescription(),
                        a.getDueDate(),
                        a.getSubject().getName(),
                        a.getTeacher().getName()
                ))
                .toList();
    }

}
