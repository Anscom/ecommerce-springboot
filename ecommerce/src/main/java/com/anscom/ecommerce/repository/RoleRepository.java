package com.anscom.ecommerce.repository;

import com.anscom.ecommerce.constant.RoleEnum;
import com.anscom.ecommerce.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(RoleEnum name);
}