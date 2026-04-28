package com.hcmut.backend.repository;

import com.hcmut.backend.model.DailySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailySummaryRepository extends JpaRepository<DailySummary, Long> {

    // 1. Tìm bản ghi của 1 user trong 1 ngày cụ thể (để tránh tạo trùng lặp nếu Cronjob lỡ chạy 2 lần)
    Optional<DailySummary> findByUserIdAndSummaryDate(String userId, LocalDate summaryDate);

    // 2. Cực kỳ quan trọng cho Heatmap: Lấy tóm tắt của user trong 1 năm (hoặc 1 tháng) sắp xếp theo ngày
    List<DailySummary> findByUserIdAndSummaryDateBetweenOrderBySummaryDateAsc(String userId, LocalDate startDate, LocalDate endDate);
}