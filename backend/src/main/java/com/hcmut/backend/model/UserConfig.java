package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name = "userconfigs")
public class UserConfig {

    @Id
    private UUID userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
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
