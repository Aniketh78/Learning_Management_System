package com.example.lms_java.controller;

import com.example.lms_java.dto.AssignTeacherRequest;
import com.example.lms_java.entity.TeacherSubject;
import com.example.lms_java.repository.TeacherSubjectRepository;
import com.example.lms_java.service.TeacherSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/assign")
@RequiredArgsConstructor
public class TeacherSubjectController {
    private final TeacherSubjectService service;

    @PostMapping
    public void assign(@RequestBody AssignTeacherRequest request) {
        service.assignTeacher(request);
    }
}
