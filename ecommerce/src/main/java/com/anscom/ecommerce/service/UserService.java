package com.anscom.ecommerce.service;

import com.anscom.ecommerce.dto.request.LoginRequest;
import com.anscom.ecommerce.dto.request.SignUpRequest;
import com.anscom.ecommerce.dto.response.JWTResponse;
import com.anscom.ecommerce.dto.response.MessageResponse;
import com.anscom.ecommerce.dto.response.TokenRefreshResponse;

import com.anscom.ecommerce.model.User;
import jakarta.mail.Message;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

public interface UserService {
    MessageResponse registerUser(SignUpRequest signUpRequest);
    JWTResponse loginUser(LoginRequest loginRequest);
    MessageResponse forgotPassword(String email);
    MessageResponse resetPassword(String token, String newPassword);
    TokenRefreshResponse refreshToken(String refreshToken);
    MessageResponse logoutUser();
    Map<String, String> getProfile();
}
