package com.hcmut.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class DeviceJoinRequest {
    private String macAddress;

    private String roomCode;

    private UUID roomId;
    private Integer xPosition;
    private Integer yPosition;
}