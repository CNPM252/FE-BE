import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, isGuest } = useAuth();

  const [kpiData, setKpiData] = useState({
    sittingHours: 0,
    posturePercent: 0,
    averageDistance: 0,
    sleepHours: 0
  });
  const [heatmapData, setHeatmapData] = useState([]);
  const [message, setMessage] = useState('');
  const [chartData, setChartData] = useState([])

  // Mock data biểu đồ
  // const chartData = [
  //   { day: 'T2', hours: 3 }, { day: 'T3', hours: 4.5 },
  //   { day: 'T4', hours: 2 }, { day: 'T5', hours: 5 },
  //   { day: 'T6', hours: 4.2 }, { day: 'T7', hours: 1 },
  //   { day: 'CN', hours: 0 },
  // ];

  const currentUserId = isGuest
      ? sessionStorage.getItem('guestId')
      : (user?.id || user?.userId || user?.uuid || user?.username || (typeof user === 'string' ? user : ''));

  // Xác định năm hiện tại (2026)
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`);
  const endDate = new Date(`${currentYear}-12-31`);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUserId) return;

      try {
        // 1. Fetch Today Stats
        const todayRes = await axiosClient.get('/api/dashboard/today', {
          params: { userId: currentUserId }
        });

        if (todayRes.data.message) {
          setMessage(todayRes.data.message);
        } else if (todayRes.data) {
          setKpiData({
            sittingHours: todayRes.data.sittingHours || 0,
            posturePercent: todayRes.data.posturePercent || 0,
            averageDistance: todayRes.data.averageDistance || 0,
            sleepHours: todayRes.data.sleepHours || 0
          });
          setMessage('');
        }

        // 2. Fetch Heatmap Data (Chỉ lấy nếu không phải Guest)
        if (!isGuest) {
          const heatmapRes = await axiosClient.get('/api/dashboard/heatmap', {
            params: { userId: currentUserId, year: currentYear }
          });
          if (heatmapRes.data) {
            setHeatmapData(heatmapRes.data);
          }
        }
        //3 fetch weekly data
        const weekly = await axiosClient.get('api/dashboard/weekly-chart', {
          params: { userId: currentUserId }
        })

        if (weekly){
          setChartData(weekly.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      }
    };

    fetchDashboardData();
  }, [currentUserId, isGuest, currentYear]);

  return (
      <div className="dashboard-container">
        {message && (
            <div style={{ padding: '15px', backgroundColor: '#e7f1ff', color: '#004792', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
              {message}
            </div>
        )}

        {/* Hàng 1: Các chỉ số KPI */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-title">Đã ngồi hôm nay</div>
            <div className="kpi-value blue">{kpiData.sittingHours} giờ</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-title">Tỷ lệ tư thế chuẩn</div>
            <div className="kpi-value green">{kpiData.posturePercent}%</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-title">Khoảng cách thường giữ</div>
            <div className="kpi-value purple">{kpiData.averageDistance} cm</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-title">Tài nguyên tiết kiệm</div>
            <div className="kpi-value orange">{kpiData.sleepHours} giờ</div>
          </div>
        </div>

        {/* Hàng 2: Biểu đồ */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Thống kê thời gian ngồi</h3>
            <select className="chart-select">
              <option>Tuần này</option>
              <option>Tháng này</option>
            </select>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hàng 3: Heatmap GitHub Contributions */}
        {!isGuest && (
            <div className="heatmap-card">
              <h3>Mức độ chăm chỉ trong năm {currentYear}</h3>
              <div className="heatmap-wrapper">
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={heatmapData}
                    classForValue={(value) => {
                      if (!value || value.level === 0) {
                        return 'color-empty';
                      }
                      return `color-scale-${value.level}`;
                    }}
                    tooltipDataAttrs={(value) => {
                      if (!value || !value.date) {
                        return { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': 'Chưa có dữ liệu' };
                      }
                      // Format Tooltip hiển thị
                      return {
                        'data-tooltip-id': 'heatmap-tooltip',
                        'data-tooltip-content': `Ngày ${value.date}: Ngồi ${value.minutes} phút`,
                      };
                    }}
                />
                <ReactTooltip id="heatmap-tooltip" />
              </div>

              {/* Chú thích màu sắc */}
              <div className="heatmap-legend">
                <span>Ít</span>
                <div className="legend-box color-empty"></div>
                <div className="legend-box color-scale-1"></div>
                <div className="legend-box color-scale-2"></div>
                <div className="legend-box color-scale-3"></div>
                <div className="legend-box color-scale-4"></div>
                <span>Nhiều</span>
              </div>
            </div>
        )}
      </div>
  );
};

export default Dashboard;