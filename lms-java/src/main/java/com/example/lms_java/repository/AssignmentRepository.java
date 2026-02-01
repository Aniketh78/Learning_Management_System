package com.example.lms_java.repository;


import com.example.lms_java.entity.Assignment;
import com.example.lms_java.entity.Subject;
import com.example.lms_java.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.expression.spel.ast.Assign;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByTeacher(User teacher);

    List<Assignment> findBySubject(Subject subject);

    List<Assignment> findBySubjectIn(List<Subject> subject);

    List<Assignment> findBySubjectAndTeacher(Subject subject, User teacher);
}
