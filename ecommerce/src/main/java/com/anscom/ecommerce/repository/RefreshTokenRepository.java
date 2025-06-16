package com.anscom.ecommerce.repository;

import com.anscom.ecommerce.model.RefreshToken;
import com.anscom.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {

    Optional<RefreshToken> findByToken(String token);

    // Add this method:
    void deleteByUser(User user);
    void deleteByUserId(Long userId);

}