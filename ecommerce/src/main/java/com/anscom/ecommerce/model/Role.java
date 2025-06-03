package com.anscom.ecommerce.model;

import com.anscom.ecommerce.constant.RoleEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "Roles")
@NoArgsConstructor
@Getter
@Setter
public class Role extends IdBasedEntity implements Serializable {
    @Enumerated(EnumType.STRING)
    @Column(length = 20, unique = true)
    private RoleEnum name;

    public Role(RoleEnum name){
        this.name = name;
    }

    public RoleEnum getName() {
        return name;
    }
}
