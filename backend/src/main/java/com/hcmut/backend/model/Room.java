package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "rooms")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "owner_username")
    private String ownerUsername;

    @Column(nullable = false)
    private String name;

    @Column(name = "room_code", unique = true, nullable = false, length = 10)
    private String roomCode;

    private Integer capacity;
}