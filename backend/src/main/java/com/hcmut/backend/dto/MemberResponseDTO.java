package com.hcmut.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MemberResponseDTO {
    private UUID userId;
    private String username;
    private String inAppName;
    private LocalDateTime joinedAt;
}