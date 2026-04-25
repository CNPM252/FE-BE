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

    @Column(name = "is_active")
    private boolean isActive = false;

    @Column(name = "current_user_id")
    private String currentUser;
}
