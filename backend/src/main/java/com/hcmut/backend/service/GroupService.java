package com.hcmut.backend.service;

import com.hcmut.backend.dto.GroupDTO;
import com.hcmut.backend.model.Group;
import com.hcmut.backend.model.Room;
import com.hcmut.backend.model.User;
import com.hcmut.backend.repository.GroupRepository;
import com.hcmut.backend.repository.RoomRepository;
import com.hcmut.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public List<GroupDTO> getGroupsByRoom(UUID roomId) {
        return groupRepository.findByRoomId(roomId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GroupDTO createGroup(UUID roomId, GroupDTO request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng máy!"));

        User manager = userRepository.findByUsername(request.getManagerUsername())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy User/Giáo viên quản lý!"));

        Group group = new Group();
        group.setName(request.getName());
        group.setRoom(room);
        group.setManager(manager);

        Group savedGroup = groupRepository.save(group);
        return convertToDTO(savedGroup);
    }

    @Transactional
    public void deleteGroup(UUID groupId) {
        groupRepository.deleteById(groupId);
    }

    private GroupDTO convertToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        if (group.getManager() != null) dto.setManagerUsername(group.getManager().getUsername());
        if (group.getRoom() != null) dto.setRoomId(group.getRoom().getId());
        dto.setCreatedAt(group.getCreatedAt());
        return dto;
    }


}