package com.example.lms_java.repository;

import com.example.lms_java.entity.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Long> {
    List<TeacherSubject> findByTeacherId(Long teacherId);
    List<TeacherSubject> findBySubjectId(Long subjectId);
    boolean existsByTeacherIdAndSubjectId(Long teacherId, Long subjectId);
}
