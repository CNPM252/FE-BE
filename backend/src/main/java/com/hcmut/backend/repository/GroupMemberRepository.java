package com.hcmut.backend.repository;

import com.hcmut.backend.model.GroupMember;
import com.hcmut.backend.model.GroupMemberKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMemberKey> {

    List<GroupMember> findByIdGroupId(UUID groupId);

    List<GroupMember> findByIdUserId(UUID userId);
}