package com.hcmut.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class GroupMemberKey implements Serializable {
    @Column(name = "group_id")
    private UUID groupId;

    @Column(name = "user_id")
    private UUID userId;
}