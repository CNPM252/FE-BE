package com.hcmut.backend.repository;

import com.hcmut.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {

    List<Group> findByRoomId(UUID roomId);

    List<Group> findByManagerId(UUID managerId);
}