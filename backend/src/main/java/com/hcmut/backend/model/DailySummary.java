package com.hcmut.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "daily_summaries", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "summary_date"})
})
public class DailySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "summary_date", nullable = false)
    private LocalDate summaryDate;

    //  Các chỉ số thống kê

    @Column(name = "total_minutes_seated")
    private Integer totalMinutesSeated = 0;

    @Column(name = "total_minutes_good_posture")
    private Integer totalMinutesGoodPosture = 0;

    @Column(name = "average_distance")
    private Integer averageDistance = 0;

    @Column(name = "average_light")
    private Integer averageLight = 0;

    //  mức độ cho ô màu trên Heatmap GitHub (0, 1, 2, 3, 4)
    public int getHeatmapLevel() {
        if (totalMinutesSeated == 0) return 0;
        if (totalMinutesSeated < 60) return 1; // Dưới 1 tiếng
        if (totalMinutesSeated < 180) return 2; // 1-3 tiếng
        if (totalMinutesSeated < 300) return 3; // 3-5 tiếng
        return 4;
    }
}