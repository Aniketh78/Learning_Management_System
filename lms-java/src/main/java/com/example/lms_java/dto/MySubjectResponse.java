package com.example.lms_java.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MySubjectResponse {
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private String teacherName;
}
