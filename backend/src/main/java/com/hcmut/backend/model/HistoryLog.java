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

    @ManyToOne
    @JoinColumn(name = "workstation_id", referencedColumnName = "id")
    private Workstation workstation;

    private Integer lightValue;
    private Integer distanceValue;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime recordedAt;
    
}
