package com.hcmut.backend.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "history_logs", indexes = {
        @Index(name = "idx_recorded_at", columnList = "recorded_at"),
        @Index(name = "idx_user_time", columnList = "current_user_id, recorded_at")
})
public class HistoryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_mac_address", referencedColumnName = "device_mac_address")
    private Device device;

    @Column(name = "current_user_id")
    private String currentUserId;

    @Column(name = "light_value")
    private Integer lightValue;

    @Column(name = "distance_value")
    private Integer distanceValue;

    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }
}
