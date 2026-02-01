package com.example.lms_java.service;

import com.example.lms_java.dto.AssignTeacherRequest;
import com.example.lms_java.entity.Role;
import com.example.lms_java.entity.Subject;
import com.example.lms_java.entity.TeacherSubject;
import com.example.lms_java.entity.User;
import com.example.lms_java.repository.SubjectRepository;
import com.example.lms_java.repository.TeacherSubjectRepository;
import com.example.lms_java.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeacherSubjectService {
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public void assignTeacher(AssignTeacherRequest request){
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if(teacher.getRole()!= Role.TEACHER){
            throw new RuntimeException("User is not a teacher");
        }

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if(teacherSubjectRepository.existsByTeacherIdAndSubjectId(teacher.getId(), subject.getId())){
            throw new RuntimeException("Teacher is already assigned to this subject");
        }

        TeacherSubject teacherSubject = new TeacherSubject();
        teacherSubject.setTeacherId(teacher.getId());
        teacherSubject.setSubjectId(subject.getId());
        teacherSubjectRepository.save(teacherSubject);
    }
}
