package com.example.lms_java.repository;

import com.example.lms_java.entity.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Long> {
    List<TeacherSubject> findByTeacherId(Long teacherId);
    List<TeacherSubject> findBySubjectId(Long subjectId);
    boolean existsByTeacherIdAndSubjectId(Long teacherId, Long subjectId);

    @Query("Select ts.subjectId, u.id, u.name from TeacherSubject ts join User u on ts.teacherId = u.id where u.role='TEACHER'order by ts.subjectId")
    List<Object []> findAllTeacherSubjectMappings();
}
