package com.hcmut.backend.repository;

import com.hcmut.backend.model.Workstation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkstationRepository extends JpaRepository<Workstation, String> {
}