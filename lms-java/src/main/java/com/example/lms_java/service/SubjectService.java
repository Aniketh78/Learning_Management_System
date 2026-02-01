package com.example.lms_java.service;

import com.example.lms_java.dto.CreateSubjectRequest;
import com.example.lms_java.dto.SubjectResponse;
import com.example.lms_java.entity.Subject;
import com.example.lms_java.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;

    public String createSubject(CreateSubjectRequest request) {

        if(subjectRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Code already exists");
        }

        Subject subject = new Subject();
        subject.setName(request.getName());
        subject.setCode(request.getCode());
        subjectRepository.save(subject);
        return "Subject created successfully";

    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToSubjectResponse)
                .collect(Collectors.toList());
    }

    private SubjectResponse mapToSubjectResponse(Subject subject) {
        SubjectResponse response = new SubjectResponse();
        response.setId(subject.getId());
        response.setName(subject.getName());
        response.setCode(subject.getCode());
        return response;
    }

}
