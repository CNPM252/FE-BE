package com.hcmut.backend.controller;

import com.hcmut.backend.dto.AddMemberRequest;
import com.hcmut.backend.service.GroupMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GroupMemberController {

    private final GroupMemberService groupMemberService;

    // Lấy danh sách
    @GetMapping("/{groupId}/members")
    public ResponseEntity<?> getGroupMembers(@PathVariable UUID groupId) {
        return ResponseEntity.ok(groupMemberService.getMembersOfGroup(groupId));
    }

    // Thêm thành viên
    @PostMapping("/{groupId}/members")
    public ResponseEntity<?> addMemberToGroup(@PathVariable UUID groupId, @RequestBody AddMemberRequest request) {
        try {
            if (request.getUsername() == null || request.getUsername().isEmpty()) {
                return ResponseEntity.badRequest().body("Thiếu thông tin MSSV!");
            }
            groupMemberService.addMemberToGroup(groupId, request.getUsername());
            return ResponseEntity.ok("Đã thêm thành viên vào nhóm thành công!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa thành viên
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable UUID groupId, @PathVariable UUID userId) {
        try {
            groupMemberService.removeMemberFromGroup(groupId, userId);
            return ResponseEntity.ok("Đã xóa thành viên khỏi nhóm!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}