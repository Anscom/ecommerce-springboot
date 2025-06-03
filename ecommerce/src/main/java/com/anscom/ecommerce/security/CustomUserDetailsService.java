package com.anscom.ecommerce.security;

import com.anscom.ecommerce.exception.UserNotFoundException;
import com.anscom.ecommerce.model.User;
import com.anscom.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Email: " + email + " not found"));

        return new CustomUserDetails(user);
    }
}