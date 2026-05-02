package com.hcmut.backend.service;

import com.hcmut.backend.dto.MemberResponseDTO;
import com.hcmut.backend.model.Group;
import com.hcmut.backend.model.GroupMember;
import com.hcmut.backend.model.GroupMemberKey;
import com.hcmut.backend.model.User;
import com.hcmut.backend.repository.GroupMemberRepository;
import com.hcmut.backend.repository.GroupRepository;
import com.hcmut.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public List<MemberResponseDTO> getMembersOfGroup(UUID groupId) {
        return groupMemberRepository.findByIdGroupId(groupId).stream().map(gm -> {
            MemberResponseDTO dto = new MemberResponseDTO();
            dto.setUserId(gm.getUser().getId());
            dto.setUsername(gm.getUser().getUsername());
            dto.setInAppName(gm.getUser().getInAppName());
            dto.setJoinedAt(gm.getJoinedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void addMemberToGroup(UUID groupId, UUID userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Nhóm (Group) này!"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy User này trong hệ thống!"));

        GroupMemberKey key = new GroupMemberKey(groupId, userId);

        if (groupMemberRepository.existsById(key)) {
            throw new IllegalArgumentException("User này đã là thành viên của Nhóm rồi!");
        }

        GroupMember newMember = new GroupMember();
        newMember.setId(key);
        newMember.setGroup(group);
        newMember.setUser(user);

        groupMemberRepository.save(newMember);
    }

    @Transactional
    public void removeMemberFromGroup(UUID groupId, UUID userId) {
        GroupMemberKey key = new GroupMemberKey(groupId, userId);
        if (groupMemberRepository.existsById(key)) {
            groupMemberRepository.deleteById(key);
        }
    }
}