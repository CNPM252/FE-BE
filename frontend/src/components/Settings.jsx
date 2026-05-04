import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import '../styles/Settings.css';

const Settings = () => {
  const { user, isGuest } = useAuth();

  // Map tên biến KHỚP 100% VỚI MODEL UserConfig TRONG JAVA
  const [config, setConfig] = useState({
    distanceThresholdMin: 40,
    distanceThresholdMax: 70,
    autoDimEnabled: false,
    manualLightLevel: 50,
    autoSleepEnabled: true,
    sleepTimeoutMins: 3
  });

  const currentUserId = isGuest
      ? sessionStorage.getItem('guestId')
      : (user?.id || user?.userId || user?.uuid || user?.username || (typeof user === 'string' ? user : ''));

  useEffect(() => {
    const fetchConfig = async () => {
      if (!currentUserId) return;
      try {
        const res = await axiosClient.get(`/api/workstations/${currentUserId}/config`);

        if (res.data) {
          // Áp dụng dữ liệu từ server đè lên state hiện tại
          setConfig(prev => ({
            ...prev,
            distanceThresholdMin: res.data.distanceThresholdMin ?? 40,
            distanceThresholdMax: res.data.distanceThresholdMax ?? 70,
            autoDimEnabled: res.data.autoDimEnabled ?? false,
            manualLightLevel: res.data.manualLightLevel ?? 50,
            autoSleepEnabled: res.data.autoSleepEnabled ?? true,
            sleepTimeoutMins: res.data.sleepTimeoutMins ?? 3
          }));
        }
      } catch (error) {
        console.error("Lỗi khi tải cấu hình từ server:", error);
      }
    };
    fetchConfig();
  }, [currentUserId, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : Number(value)
    });
  };

  const handleSave = async () => {
    if (!currentUserId) {
      alert("Không tìm thấy ID người dùng!");
      return;
    }

    try {
      await axiosClient.put(`/api/workstations/${currentUserId}/config`, config);
      alert("Đã lưu cấu hình thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình:", error);
      alert("Có lỗi xảy ra khi lưu! Vui lòng kiểm tra lại kết nối.");
    }
  };

  return (
      <div className="settings-container">
        <div className="settings-card">
          <h2 className="settings-title">Cấu hình hệ thống</h2>

          <div className="input-row">
            <div className="input-group">
              <label>Khoảng cách gần nhất (cm)</label>
              <input
                  type="number"
                  name="distanceThresholdMin"
                  value={config.distanceThresholdMin}
                  onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>Khoảng cách xa nhất (cm)</label>
              <input
                  type="number"
                  name="distanceThresholdMax"
                  value={config.distanceThresholdMax}
                  onChange={handleChange}
              />
            </div>
          </div>

          <div className="divider"></div>

          <div className="checkbox-group">
            <input
                type="checkbox"
                id="autoDimEnabled"
                name="autoDimEnabled"
                checked={config.autoDimEnabled}
                onChange={handleChange}
            />
            <label htmlFor="autoDimEnabled">Auto-dim (Tự động điều chỉnh độ sáng)</label>
          </div>

          {!config.autoDimEnabled && (
              <div className="sub-setting">
                <div className="sub-setting-header">
                  Độ sáng thủ công: <span>{config.manualLightLevel}%</span>
                </div>
                <input
                    type="range"
                    name="manualLightLevel"
                    min="0" max="100"
                    value={config.manualLightLevel}
                    onChange={handleChange}
                />
              </div>
          )}

          <div className="divider"></div>

          <div className="checkbox-group">
            <input
                type="checkbox"
                id="autoSleepEnabled"
                name="autoSleepEnabled"
                checked={config.autoSleepEnabled}
                onChange={handleChange}
            />
            <label htmlFor="autoSleepEnabled">Auto-sleep (Tự động tắt khi vắng mặt)</label>
          </div>

          {config.autoSleepEnabled && (
              <div className="sub-setting" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="sub-setting-header" style={{ marginBottom: '8px' }}>
                  Thời gian chờ trước khi Sleep (phút)
                </div>
                <input
                    type="number"
                    name="sleepTimeoutMins"
                    value={config.sleepTimeoutMins}
                    onChange={handleChange}
                    style={{ width: '120px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
          )}

          <button className="btn-save" onClick={handleSave}>
            Lưu Cài Đặt
          </button>
        </div>
      </div>
  );
};

export default Settings;