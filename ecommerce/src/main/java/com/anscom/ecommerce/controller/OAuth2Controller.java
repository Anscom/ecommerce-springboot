package com.anscom.ecommerce.controller;

import com.anscom.ecommerce.constant.RoleEnum;
import com.anscom.ecommerce.dto.response.JWTResponse;
import com.anscom.ecommerce.dto.response.MessageResponse;
import com.anscom.ecommerce.jwt.JwtUtils;
import com.anscom.ecommerce.model.RefreshToken;
import com.anscom.ecommerce.model.Role;
import com.anscom.ecommerce.model.User;
import com.anscom.ecommerce.service.RefreshTokenService;
import com.anscom.ecommerce.service.RoleService;
import com.anscom.ecommerce.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RequestMapping("/oauth2")
public class OAuth2Controller {
    private final UserService userService;

    private final RoleService roleService;

    private final RefreshTokenService refreshTokenService;

    private final PasswordEncoder encoder;

    private final JwtUtils jwtUtils;

    public OAuth2Controller(UserService userService, RoleService roleService, RefreshTokenService refreshTokenService, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.userService = userService;
        this.roleService = roleService;
        this.refreshTokenService = refreshTokenService;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/success")
    public ResponseEntity<?> loginSuccess(OAuth2AuthenticationToken authentication) {
        Map<String, Object> attributes = authentication.getPrincipal().getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Optional<User> optionalUser = userService.findByEmail(email);

        // ❌ If user already exists, return a conflict
        if (optionalUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new MessageResponse("Error: Email is already registered. Please login using email/password."));
        }

        // ✅ Otherwise, register the user
        User user = new User();
        user.setEmail(email);
        user.setUsername(name);
        user.setPassword(encoder.encode(UUID.randomUUID().toString())); // Random placeholder password

        // Assign default role
        Role userRole = roleService.findByName(RoleEnum.ROLE_USER)
                .orElseGet(() -> new Role(RoleEnum.ROLE_USER));

        user.setRoles(Set.of(userRole));
        userService.saveUser(user);

        // Generate JWT and Refresh Token
        String jwt = jwtUtils.generateJwtToken(email);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        JWTResponse jwtResponse = new JWTResponse();
        jwtResponse.setEmail(user.getEmail());
        jwtResponse.setUsername(user.getUsername());
        jwtResponse.setId(user.getId());
        jwtResponse.setToken(jwt);
        jwtResponse.setRefreshToken(refreshToken.getToken());
        jwtResponse.setRoles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()));

        return ResponseEntity.ok(jwtResponse);
    }


    @GetMapping("/failure")
    public ResponseEntity<?> loginFailure() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OAuth login failed.");
    }
}
