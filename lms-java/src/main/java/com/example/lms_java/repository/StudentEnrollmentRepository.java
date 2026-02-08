package com.example.lms_java.repository;

import com.example.lms_java.entity.StudentEnrollment;
import com.example.lms_java.entity.Subject;
import com.example.lms_java.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
    List<StudentEnrollment> findByStudent(User student);
    List<StudentEnrollment> findByTeacher(User teacher);
    boolean existsByStudentAndTeacher(User student, User teacher);
    boolean existsByStudentAndSubjectId(User student, Long subjectId);
    Optional<StudentEnrollment> findByStudentAndSubject(User student, Subject subject);

    @Query("Select se from StudentEnrollment se " +
            "join fetch se.subject s " +
            "join fetch se.teacher t " +
            "where se.student = :student")
    List<StudentEnrollment> findByStudentWithDetails(@Param("student") User student);
}
