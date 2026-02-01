package com.example.lms_java.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class EnrollmentOptionResponse {
    private Long subjectId;
    private String subjectName;
    private List<TeacherOption> teachers;
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherOption {
        private Long id;
        private String name;

    }
}
