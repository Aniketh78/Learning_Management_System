package com.example.lms_java.service;

import com.example.lms_java.dto.CreateUserRequest;
import com.example.lms_java.dto.UserResponse;
import com.example.lms_java.entity.Role;
import com.example.lms_java.entity.User;
import com.example.lms_java.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void createTeacher(CreateUserRequest createUserRequest){
        createUser(createUserRequest, Role.TEACHER);
    }
    public void createStudent(CreateUserRequest createUserRequest){
        createUser(createUserRequest, Role.STUDENT);
    }

    public void createUser(CreateUserRequest createUserRequest, Role role){
        if (userRepository.findByEmail(createUserRequest.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setName(createUserRequest.getName());
        user.setEmail(createUserRequest.getEmail());
        user.setPassword(passwordEncoder.encode(createUserRequest.getPassword()));
        user.setRole(role);
        user.setEnabled(true);
        userRepository.save(user);
    }

    public List<UserResponse> getAllTeachers() {
        return userRepository.findByRole(Role.TEACHER).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllStudents() {
        return userRepository.findByRole(Role.STUDENT).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setEnabled(user.isEnabled());
        return response;
    }
}
