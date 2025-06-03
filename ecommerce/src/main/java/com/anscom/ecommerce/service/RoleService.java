package com.anscom.ecommerce.service;

import com.anscom.ecommerce.constant.RoleEnum;
import com.anscom.ecommerce.model.Role;
import com.anscom.ecommerce.repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public Optional<Role> findByName(RoleEnum name) {
        return roleRepository.findByName(name);
    }

}