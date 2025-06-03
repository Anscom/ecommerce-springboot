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
import com.anscom.ecommerce.service.RefreshTokenService;
import com.anscom.ecommerce.service.RoleService;
import com.anscom.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/authenticate")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    private final RoleService roleService;

    private final RefreshTokenService refreshTokenService;

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder encoder;

    private final JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {

        String username = signUpRequest.getUsername();
        String email = signUpRequest.getEmail();
        String password = signUpRequest.getPassword();
        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if(userService.existsByEmail(email)){
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already taken!"));
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(encoder.encode(password));

        if (strRoles != null) {
            strRoles.forEach(role -> {
                switch (role) {
                    case "ROLE_ADMIN":
                        Role adminRole = null;

                        if(roleService.findByName(RoleEnum.ROLE_ADMIN).isEmpty()){
                            adminRole = new Role(RoleEnum.ROLE_ADMIN);
                        }else{
                            adminRole = roleService.findByName(RoleEnum.ROLE_ADMIN)
                                    .orElseThrow(() -> new RoleException("Error: Admin Role is not found."));
                        }

                        roles.add(adminRole);

                        break;
                    default:
                        Role userRole = null;

                        if(roleService.findByName(RoleEnum.ROLE_USER).isEmpty()){
                            userRole = new Role(RoleEnum.ROLE_USER);
                        }else{
                            userRole = roleService.findByName(RoleEnum.ROLE_USER)
                                    .orElseThrow(() -> new RoleException("Error: User Role is not found."));
                        }

                        roles.add(userRole);
                }
            });
        }else{
            roleService.findByName(RoleEnum.ROLE_USER).ifPresentOrElse(roles::add, () -> roles.add(new Role(RoleEnum.ROLE_USER)));
        }

        user.setRoles(roles);
        userService.saveUser(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(email,password);

        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(userDetails.getEmail());

        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        JWTResponse jwtResponse = new JWTResponse();
        jwtResponse.setEmail(userDetails.getEmail());
        jwtResponse.setUsername(userDetails.getUsername());
        jwtResponse.setId(userDetails.getId());
        jwtResponse.setToken(jwt);
        jwtResponse.setRefreshToken(refreshToken.getToken());
        jwtResponse.setRoles(roles);

        return ResponseEntity.ok(jwtResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> optionalUser = userService.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User with this email does not exist."));
        }

        User user = optionalUser.get(); // unwrap the user

        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(Instant.now().plus(15, ChronoUnit.MINUTES));
        userService.saveUser(user);

        String resetLink = "http://localhost:8080/authenticate/reset-password?token=" + token;

        // TODO: Send email
        System.out.println("Password reset link: " + resetLink);

        return ResponseEntity.ok(new MessageResponse("Reset password link sent to email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        Optional<User> optionalUser = userService.findByResetPasswordToken(token);

        if (optionalUser.isEmpty() || optionalUser.get().getResetPasswordTokenExpiry().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid or expired token."));
        }

        User user = optionalUser.get();
        user.setPassword(encoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);

        userService.saveUser(user);

        return ResponseEntity.ok(new MessageResponse("Password reset successful!"));
    }



    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@RequestBody TokenRefreshRequest request) {

        String requestRefreshToken = request.getRefreshToken();

        RefreshToken token = refreshTokenService.findByToken(requestRefreshToken)
                .orElseThrow(() -> new RefreshTokenException(requestRefreshToken + "Refresh token is not in database!"));

        RefreshToken deletedToken = refreshTokenService.verifyExpiration(token);

        User userRefreshToken = deletedToken.getUser();

        String newToken = jwtUtils.generateTokenFromUsername(userRefreshToken.getUsername());

        return ResponseEntity.ok(new TokenRefreshResponse(newToken, requestRefreshToken));
    }

}