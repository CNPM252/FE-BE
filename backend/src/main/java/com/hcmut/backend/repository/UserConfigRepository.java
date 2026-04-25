package com.hcmut.backend.repository;

import com.hcmut.backend.model.UserConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserConfigRepository extends JpaRepository<UserConfig, UUID> {
}