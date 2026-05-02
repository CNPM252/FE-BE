package com.hcmut.backend.repository;

import com.hcmut.backend.model.Device;
import com.hcmut.backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, String> {
    Optional<Device> findByCurrentUser(String currentUser);

    List<Device> findByRoomId(UUID roomId);
}
