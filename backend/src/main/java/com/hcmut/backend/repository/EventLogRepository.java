package com.hcmut.backend.repository;

import com.hcmut.backend.model.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

public interface EventLogRepository extends JpaRepository<EventLog, Long> {
    // Dành cho Sinh viên: Xem lịch sử sự kiện của chính mình
    List<EventLog> findByActedByUserOrderByCreatedAtDesc(String username);

    // Dành cho Giáo viên: Xem tất cả sự kiện xảy ra trên một máy cụ thể
    List<EventLog> findByDevice_MacAddressOrderByCreatedAtDesc(String macAddress);

    //  Dành cho Giáo viên: Xem sự kiện của một sinh viên cụ thể trong nhóm
    List<EventLog> findByActedByUserAndDevice_MacAddress(String username, String macAddress);
}