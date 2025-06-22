package com.anscom.ecommerce.service;
import com.anscom.ecommerce.constant.RoleEnum;
import com.anscom.ecommerce.dto.request.LoginRequest;
import com.anscom.ecommerce.dto.request.SignUpRequest;
import com.anscom.ecommerce.dto.response.JWTResponse;
import com.anscom.ecommerce.dto.response.MessageResponse;
import com.anscom.ecommerce.dto.response.TokenRefreshResponse;
import com.anscom.ecommerce.exception.RefreshTokenException;
import com.anscom.ecommerce.exception.RoleException;
import com.anscom.ecommerce.jwt.JwtUtils;
import com.anscom.ecommerce.model.RefreshToken;
import com.anscom.ecommerce.model.Role;
import com.anscom.ecommerce.model.User;
import com.anscom.ecommerce.repository.RefreshTokenRepository;
import com.anscom.ecommerce.repository.UserRepository;
import com.anscom.ecommerce.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public MessageResponse registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new MessageResponse("Error: Email is already taken!");
        }

        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<Role> roles = new HashSet<>();
        Set<String> strRoles = signUpRequest.getRoles();

        if (strRoles != null) {
            for (String role : strRoles) {
                RoleEnum roleEnum = RoleEnum.valueOf(role);
                Role roleEntity = roleService.findByName(roleEnum)
                        .orElseThrow(() -> new RoleException("Error: Role " + role + " is not found."));
                roles.add(roleEntity);
            }
        } else {
            Role userRole = roleService.findByName(RoleEnum.ROLE_USER)
                    .orElse(new Role(RoleEnum.ROLE_USER));
            roles.add(userRole);
        }

        user.setRoles(roles);
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }

    @Override
    public JWTResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails.getEmail());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JWTResponse(jwt, "Bearer", refreshToken.getToken(),
                userDetails.getUsername(), userDetails.getEmail(), roles);    }

    @Override
    public MessageResponse forgotPassword(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return new MessageResponse("User with this email does not exist.");
        }

        User user = optionalUser.get();
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(Instant.now().plus(15, ChronoUnit.MINUTES));
        userRepository.save(user);

        String resetLink = "http://localhost:8080/authenticate/reset-password?token=" + token;
        String subject = "Reset your password";
        String body = "Click the following link to reset your password:\n" + resetLink;
        emailService.sendEmail(user.getEmail(), subject, body);

        return new MessageResponse("Reset password link sent to your email.");
    }

    @Override
    public MessageResponse resetPassword(String token, String newPassword) {
        Optional<User> optionalUser = userRepository.findByResetPasswordToken(token);

        if (optionalUser.isEmpty() || optionalUser.get().getResetPasswordTokenExpiry().isBefore(Instant.now())) {
            return new MessageResponse("Invalid or expired token.");
        }

        User user = optionalUser.get();
        user.setPassword(encoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        return new MessageResponse("Password reset successful!");
    }

    @Override
    public TokenRefreshResponse refreshToken(String requestToken) {
        RefreshToken token = refreshTokenService.findByToken(requestToken)
                .orElseThrow(() -> new RefreshTokenException(requestToken + " Refresh token is not in database!"));

        RefreshToken verifiedToken = refreshTokenService.verifyExpiration(token);
        String newToken = jwtUtils.generateTokenFromUsername(verifiedToken.getUser().getUsername());

        return new TokenRefreshResponse(newToken, requestToken);
    }

    @Override
    public Map<String, String> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            Map<String, String> profile = new HashMap<>();
            profile.put("username", userDetails.getUsername());
            profile.put("email", userDetails.getEmail());

            return profile;
        }

        throw new RuntimeException("User is not authenticated.");
    }

    @Override
    public MessageResponse logoutUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            Long userId = (long) userDetails.getId();
            refreshTokenService.deleteByUserId(userId);
            return new MessageResponse("Logout successful.");
        }

        return new MessageResponse("User is not authenticated.");
    }





}