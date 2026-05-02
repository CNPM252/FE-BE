package com.hcmut.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AddMemberRequest {
    private UUID userId;
}