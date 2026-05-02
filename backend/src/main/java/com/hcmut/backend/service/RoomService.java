package com.hcmut.backend.service;

import com.hcmut.backend.dto.RoomDTO;
import com.hcmut.backend.model.Room;
import com.hcmut.backend.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO createRoom(RoomDTO request) {
        if (roomRepository.findByRoomCode(request.getRoomCode()).isPresent()) {
            throw new IllegalArgumentException("Mã phòng (Room Code) này đã được sử dụng!");
        }

        Room room = new Room();
        room.setName(request.getName());
        room.setRoomCode(request.getRoomCode());
        room.setCapacity(request.getCapacity());

        Room savedRoom = roomRepository.save(room);
        return convertToDTO(savedRoom);
    }

    public void deleteRoom(UUID id) {
        roomRepository.deleteById(id);
    }

    // Helper: Chuyển từ Entity sang DTO
    private RoomDTO convertToDTO(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setRoomCode(room.getRoomCode());
        dto.setCapacity(room.getCapacity());
        return dto;
    }
}