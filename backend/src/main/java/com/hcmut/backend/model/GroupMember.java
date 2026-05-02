package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "group_members")
public class GroupMember {

    @EmbeddedId
    private GroupMemberKey id = new GroupMemberKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("groupId")
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;
}