package com.example.lms_java.repository;

import com.example.lms_java.entity.Assignment;
import com.example.lms_java.entity.Submission;
import com.example.lms_java.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByAssignment( Assignment assignment);

    List<Submission> findByStudent(User student);

    boolean existsByAssignmentAndStudent(Assignment assignment, User student);
}