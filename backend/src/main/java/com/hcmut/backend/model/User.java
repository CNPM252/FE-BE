package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonProperty(value = "password", access = JsonProperty.Access.WRITE_ONLY)
    private String passwordHash;

    @Column(columnDefinition = "varchar(255) default 'ROLE_USER'")
    private String role = "ROLE_USER";

    private String inAppName;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
}
