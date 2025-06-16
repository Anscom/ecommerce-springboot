package com.anscom.ecommerce.controller;

import com.anscom.ecommerce.constant.RoleEnum;
import com.anscom.ecommerce.dto.request.LoginRequest;
import com.anscom.ecommerce.dto.request.SignUpRequest;
import com.anscom.ecommerce.dto.request.TokenRefreshRequest;
import com.anscom.ecommerce.dto.response.JWTResponse;
import com.anscom.ecommerce.dto.response.MessageResponse;
import com.anscom.ecommerce.dto.response.TokenRefreshResponse;
import com.anscom.ecommerce.exception.RefreshTokenException;
import com.anscom.ecommerce.exception.RoleException;
import com.anscom.ecommerce.jwt.JwtUtils;
import com.anscom.ecommerce.model.RefreshToken;
import com.anscom.ecommerce.model.Role;
import com.anscom.ecommerce.model.User;
import com.anscom.ecommerce.security.CustomUserDetails;
import com.anscom.ecommerce.service.EmailService;
import com.anscom.ecommerce.service.RefreshTokenService;
import com.anscom.ecommerce.service.RoleService;
import com.anscom.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/authenticate")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest request) {
        try {
            MessageResponse response = userService.registerUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        try {
            JWTResponse response = userService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid login credentials."));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            MessageResponse response = userService.forgotPassword(request.get("email"));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            MessageResponse response = userService.resetPassword(request.get("token"), request.get("password"));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@RequestBody TokenRefreshRequest request) {
        try {
            TokenRefreshResponse response = userService.refreshToken(request.getRefreshToken());
            return ResponseEntity.ok(response);
        } catch (RefreshTokenException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        return ResponseEntity.ok(userService.logoutUser());
    }



    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getProfile() {
        return ResponseEntity.ok(userService.getProfile());
    }
}