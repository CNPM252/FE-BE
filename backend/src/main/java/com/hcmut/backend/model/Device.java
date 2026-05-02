package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "devices")
public class Device {

    @Id
    @Column(unique = true, name = "device_mac_address")
    private String macAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "is_active")
    private boolean isActive = false;

    @Column(name = "current_user_id")
    private String currentUser;

    @Column(name = "x_position")
    private Integer xPosition;

    @Column(name = "y_position")
    private Integer yPosition;
}
