package com.example.lms_java.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor

public class AssignTeacherRequest {
    Long teacherId;
    Long subjectId;
}
