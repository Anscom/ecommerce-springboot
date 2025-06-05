package com.anscom.ecommerce.jwt;

import com.anscom.ecommerce.constant.RoleEnum;
import com.anscom.ecommerce.exception.RoleException;
import com.anscom.ecommerce.model.Role;
import com.anscom.ecommerce.model.User;
import com.anscom.ecommerce.repository.UserRepository;
import com.anscom.ecommerce.service.RoleService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository; // Assuming you save users
    private final JwtUtils jwtUtils;
    private final RoleService roleService;


    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Extract email
        String email = oAuth2User.getAttribute("email");
        String username = oAuth2User.getAttribute("name");

        Set<Role> roles = new HashSet<>();

        Role userRole = roleService.findByName(RoleEnum.ROLE_USER)
                .orElseThrow(() -> new RoleException("Error: User Role is not found."));

        roles.add(userRole);

        // Save to DB if not exists
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            User user = new User();
            user.setRoles(roles);
            user.setEmail(email);
            user.setUsername(username);
            userRepository.save(user);
        }


        // Generate JWT token
        String token = jwtUtils.generateTokenFromUsername(email);

        // Redirect to frontend with token as query param
        String redirectUrl = "http://localhost:5173/oauth2/success?token=" + token;
        response.sendRedirect(redirectUrl);
    }
}
