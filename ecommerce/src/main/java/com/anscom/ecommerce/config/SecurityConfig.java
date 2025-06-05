package com.anscom.ecommerce.config;

import com.anscom.ecommerce.jwt.AuthTokenFilter;
import com.anscom.ecommerce.jwt.JWTAccessDeniedHandler;
import com.anscom.ecommerce.jwt.JwtAuthenticationEntryPoint;
import com.anscom.ecommerce.jwt.JwtUtils;
import com.anscom.ecommerce.jwt.CustomOAuth2SuccessHandler;
import com.anscom.ecommerce.security.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JWTAccessDeniedHandler accessDeniedHandler;
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    @Bean
    public AuthenticationManager authenticationManager(final AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {}) // use default cors config
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .accessDeniedHandler(accessDeniedHandler)
                        .authenticationEntryPoint(authenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/authenticate/signup",
                                "/authenticate/login",
                                "/authenticate/refreshtoken",
                                "/authenticate/forgot-password",
                                "/authenticate/reset-password",
                                "/oauth2/**"
                        )
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/item/createItem").hasRole("ADMIN") // Require auth for POST
                        .requestMatchers(HttpMethod.PUT, "/item/updateItem/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/item/deleteItem/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/item/**").permitAll() // Allow GET only
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(customOAuth2SuccessHandler)
                        .failureUrl("/oauth2/failure")
                )
                .addFilterBefore(authenticationJwtTokenFilter(jwtUtils, customUserDetailsService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter(JwtUtils jwtUtils, CustomUserDetailsService customUserDetailsService) {
        return new AuthTokenFilter(jwtUtils, customUserDetailsService);
    }
}