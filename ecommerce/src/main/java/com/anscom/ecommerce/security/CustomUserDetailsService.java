package com.anscom.ecommerce.security;

import com.anscom.ecommerce.exception.UserNotFoundException;
import com.anscom.ecommerce.model.User;
import com.anscom.ecommerce.repository.UserRepository;
import com.anscom.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Email: " + email + " not found"));

        return new CustomUserDetails(user);
    }
}