package com.anscom.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JWTResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private String username;
    private String email;
    private List<String> roles;

}