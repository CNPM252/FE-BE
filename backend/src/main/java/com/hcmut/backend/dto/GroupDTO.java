package com.hcmut.backend.dto;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDateTime;

@Data
public class GroupDTO {
    private UUID id;
    private String name;
    private String managerUsername;
    private UUID roomId;
    private LocalDateTime createdAt;
}