package com.hcmut.backend.controller;

import com.hcmut.backend.dto.GroupDTO;
import com.hcmut.backend.service.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping("/rooms/{roomId}/groups")
    public ResponseEntity<?> getGroupsByRoom(@PathVariable UUID roomId) {
        return ResponseEntity.ok(groupService.getGroupsByRoom(roomId));
    }

    @PostMapping("/rooms/{roomId}/groups")
    public ResponseEntity<?> createGroup(@PathVariable UUID roomId, @RequestBody GroupDTO groupDTO) {
        try {
            if (groupDTO.getName() == null || groupDTO.getManagerUsername() == null) {
                return ResponseEntity.badRequest().body("Thiếu tên nhóm hoặc ID người quản lý!");
            }
            GroupDTO newGroup = groupService.createGroup(roomId, groupDTO);
            return ResponseEntity.ok(newGroup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/groups/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable UUID groupId) {
        try {
            groupService.deleteGroup(groupId);
            return ResponseEntity.ok("Đã xóa nhóm thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}