package com.example.lms_java.service;

import com.example.lms_java.entity.User;
import com.example.lms_java.repository.SubmissionRepository;
import com.example.lms_java.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TestService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional
    public String saveUserSub(User user) throws Exception {
        userRepository.save(user);
        return testMethos();
    }

    public String testMethos() throws Exception {
        int i =1;
        if(i==1){

            throw new RuntimeException("Error has occurred");
        }
        return "sucess";
    }

}
