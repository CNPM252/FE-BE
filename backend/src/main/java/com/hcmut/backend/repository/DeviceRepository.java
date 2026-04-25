package com.hcmut.backend.repository;

import com.hcmut.backend.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, String> {
    Optional<Device> findByCurrentUser(String currentUser);
}
