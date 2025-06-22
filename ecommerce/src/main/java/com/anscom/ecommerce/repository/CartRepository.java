package com.anscom.ecommerce.repository;

import com.anscom.ecommerce.model.Cart;
import com.anscom.ecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
