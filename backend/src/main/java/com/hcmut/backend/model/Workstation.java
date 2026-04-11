package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;
// import java.util.UUID;


@Data
@Entity
@Table(name = "workstations")
public class Workstation {
    @Id
    @Column(name = "id", length = 50)
    private String id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true)
    private User user;

    @Column(columnDefinition = "boolean default true")
    private boolean autoDimEnabled = true;

    @Column(columnDefinition = "boolean default true")
    private boolean autoSleepEnabled = true;

    private Integer manualLightLevel;

    @Column(columnDefinition = "integer default 3")
    private Integer sleepTimeoutMins = 3;

    private Integer distanceThresholdMin;
    private Integer distanceThresholdMax;
    
}
