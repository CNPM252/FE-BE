import React, { useState, useEffect } from 'react';
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalMinutesSeated: 0,
    totalMinutesGoodPosture: 0,
    averageDistance: 0,
    averageLight: 0,
    heatmapLevel: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailySummary();
  }, []);

  const fetchDailySummary = async () => {
    const token = localStorage.getItem('token');
    try {
      // Giả sử có API lấy summary ngày hôm nay: /api/dailysummaries/today
      const response = await fetch('http://localhost:8080/api/dashboard/summary/today', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  // Tính phần trăm ngồi đúng tư thế
  const postureRatio = summary.totalMinutesSeated === 0
      ? 0
      : Math.round((summary.totalMinutesGoodPosture / summary.totalMinutesSeated) * 100);

  return (
      <div className="dashboard-container">
        <h2>📊 Tổng quan hôm nay</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon time-icon">⏱️</div>
            <div className="stat-info">
              <h3>Thời gian ngồi</h3>
              <p>{summary.totalMinutesSeated} phút</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon posture-icon">🧘‍♂️</div>
            <div className="stat-info">
              <h3>Tư thế chuẩn</h3>
              <p>{postureRatio}% ({summary.totalMinutesGoodPosture} phút)</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon distance-icon">📏</div>
            <div className="stat-info">
              <h3>Khoảng cách TB</h3>
              <p>{summary.averageDistance} cm</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon light-icon">💡</div>
            <div className="stat-info">
              <h3>Ánh sáng TB</h3>
              <p>{summary.averageLight} lux</p>
            </div>
          </div>
        </div>

        <div className="heatmap-section">
          <h3>Mức độ tập trung (Minh họa Heatmap)</h3>
          <div className="heatmap-display">
            Mức độ hoạt động hôm nay:
            <span className={`heat-level level-${summary.heatmapLevel}`}>
                        Level {summary.heatmapLevel}
                    </span>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;