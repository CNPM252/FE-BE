package com.hcmut.backend.controller;

import com.hcmut.backend.dto.RoomDTO;
import com.hcmut.backend.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomService roomService;

    // Lấy danh sách tất cả các phòng
    // GET: http://localhost:8080/api/rooms
    @GetMapping
    public ResponseEntity<?> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // Tạo phòng mới
    // POST: http://localhost:8080/api/rooms
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody RoomDTO roomDTO) {
        try {
            RoomDTO newRoom = roomService.createRoom(roomDTO);
            return ResponseEntity.ok(newRoom);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Xóa phòng
    // DELETE: http://localhost:8080/api/rooms/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Đã xóa phòng thành công!");
    }
}