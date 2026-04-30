package com.hcmut.backend.controller;

import com.hcmut.backend.model.DailySummary;
import com.hcmut.backend.repository.DailySummaryRepository;
import com.hcmut.backend.repository.HistoryLogRepository;
import com.hcmut.backend.repository.UserConfigRepository;
import com.hcmut.backend.model.UserConfig;
import com.hcmut.backend.model.HistoryLog;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DailySummaryRepository dailySummaryRepository;
    private final UserConfigRepository userConfigRepository;
    private final HistoryLogRepository historyLogRepository;

    @GetMapping("/heatmap")
    public ResponseEntity<?> getHeatmapData(
            @RequestParam String userId,
            @RequestParam(required = false) Integer year){

        if (userId.startsWith("guest_")) {
            return ResponseEntity.ok(List.of());
        }

        int targetYear = (year != null)? year : LocalDate.now().getYear();
        LocalDate startDate = LocalDate.of(targetYear, 1, 1);
        LocalDate endDate = LocalDate.of(targetYear, 12, 31);

        List<DailySummary> summaries = dailySummaryRepository.findByUserIdAndSummaryDateBetweenOrderBySummaryDateAsc(userId, startDate, endDate);

        List<Map<String, Object>> heatmapResponse = summaries.stream().map(summary -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("date", summary.getSummaryDate().toString());
            map.put("minutes", summary.getTotalMinutesSeated());
            map.put("level", summary.getHeatmapLevel());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(heatmapResponse);
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayStats(@RequestParam String userId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        List<HistoryLog> logs = historyLogRepository.findByCurrentUserIdAndRecordedAtBetween(userId, startOfDay, now);


        UserConfig config = null;

        if (!userId.startsWith("guest_")) {
            try {
                UUID userUuid = UUID.fromString(userId);
                config = userConfigRepository.findByUserId(userUuid).orElse(null);
            } catch (IllegalArgumentException e) {
            }
        }

        if (logs.isEmpty()) {
            return ResponseEntity.ok(Map.of("message", "Chưa có dữ liệu cho ngày hôm nay"));
        }

        int totalMinutes = logs.size();
        double sittingHours = totalMinutes / 60.0;

        long sumDistance = 0;
        int goodPostureCount = 0;
        int sleepLogCount = 0;

        // Lấy ngưỡng từ config, nếu không có thì dùng mặc định (40-70cm)
        int minDist = (config != null) ? config.getDistanceThresholdMin() : 40;
        int maxDist = (config != null) ? config.getDistanceThresholdMax() : 70;

        for (HistoryLog log : logs) {
            int dist = log.getDistanceValue();
            sumDistance += dist;

            if (dist >= minDist && dist <= maxDist) {
                goodPostureCount++;
            }

            //  Sleep được tính khi khoảng cách trả về 0 hoặc 200
            if (dist == 0) {
                sleepLogCount++;
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("sittingHours", Math.round(sittingHours * 10) / 10.0); // Làm tròn 1 chữ số
        stats.put("posturePercent", (int) ((goodPostureCount * 100.0) / totalMinutes));
        stats.put("averageDistance", (int) (sumDistance / totalMinutes));
        stats.put("sleepHours", Math.round((sleepLogCount / 60.0) * 10) / 10.0);
        stats.put("totalMinutes", totalMinutes);

        return ResponseEntity.ok(stats);
    }

}
