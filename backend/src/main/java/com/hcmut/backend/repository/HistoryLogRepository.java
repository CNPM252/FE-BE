package com.hcmut.backend.repository;

import com.hcmut.backend.model.HistoryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface HistoryLogRepository extends JpaRepository<HistoryLog, Long> {
    List<HistoryLog> findByCurrentUserIdOrderByRecordedAtDesc(String currentUserId);

    List<HistoryLog> findByDevice_MacAddressOrderByRecordedAtDesc(String macAddress);
}