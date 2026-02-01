package com.example.lms_java.service;

import com.example.lms_java.dto.LoginRequest;
import com.example.lms_java.dto.LoginResponse;
import com.example.lms_java.entity.User;
import com.example.lms_java.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private  final JwtService jwtService;

    public LoginResponse login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(()-> new RuntimeException("User not found"));
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtService.generateToken(user);
        return new LoginResponse(token,user.getRole().name());
    }

}
