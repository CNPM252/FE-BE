package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;
// import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    @JsonProperty("autoDimEnabled")
    @Column(name = "auto_dim_enabled" ,columnDefinition = "boolean default true")
    private Boolean autoDimEnabled = true;

    @JsonProperty("autoSleepEnabled")
    @Column(name = "auto_sleep_enabled", columnDefinition = "boolean default true")
    private Boolean autoSleepEnabled = true;

    private Integer manualLightLevel;

    @Column(columnDefinition = "integer default 3")
    private Integer sleepTimeoutMins = 3;

    private Integer distanceThresholdMin;
    private Integer distanceThresholdMax;
    
}
