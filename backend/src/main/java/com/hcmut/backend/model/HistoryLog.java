package com.hcmut.backend.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "history_logs")
public class HistoryLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_mac_address", referencedColumnName = "device_mac_address")
    private Device device;

    @Column(name = "current_user_id")
    private String currentUserId;

    private Integer lightValue;
    private Integer distanceValue;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime recordedAt;
    
}
