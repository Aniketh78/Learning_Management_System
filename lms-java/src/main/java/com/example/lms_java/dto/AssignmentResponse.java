package com.example.lms_java.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String subjectName;
    private String teacherName;
}