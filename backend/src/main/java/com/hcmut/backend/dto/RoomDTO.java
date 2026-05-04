package com.hcmut.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class RoomDTO {
    private UUID id;
    private String ownerUsername;
    private String name;
    private String roomCode;
    private Integer capacity;
}