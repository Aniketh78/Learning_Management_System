package com.example.lms_java.controller;

import com.example.lms_java.dto.LoginRequest;
import com.example.lms_java.dto.LoginResponse;
import com.example.lms_java.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }
}
