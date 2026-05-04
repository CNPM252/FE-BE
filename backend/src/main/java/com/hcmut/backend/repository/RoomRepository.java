package com.hcmut.backend.repository;

import com.hcmut.backend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {

    Optional<Room> findByRoomCode(String roomCode);

    List<Room> findByOwnerUsername(String ownerUsername);
}