import { useState, useEffect } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [config, setConfig] = useState({
    autoDimEnabled: true,
    autoSleepEnabled: true,
    manualLightLevel: 50,
    sleepTimeoutMins: 3,
    distanceThresholdMin: 40,
    distanceThresholdMax: 70
  });
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/userconfigs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Lỗi lấy cấu hình:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/api/userconfigs', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        setStatusMsg("✅ Đã lưu cấu hình thành công!");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (error) {
      setStatusMsg("❌ Lỗi khi lưu cấu hình!");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value)
    }));
  };

  return (
      <div className="settings-container">
        <h2>⚙Cấu hình Yolo:bit</h2>

        {statusMsg && <div className="status-message">{statusMsg}</div>}

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group toggle-group">
            <label>
              <input type="checkbox" name="autoDimEnabled"
                     checked={config.autoDimEnabled} onChange={handleChange} />
              Bật chế độ Tự động điều chỉnh độ sáng (Auto-Dim)
            </label>
          </div>

          <div className="form-group toggle-group">
            <label>
              <input type="checkbox" name="autoSleepEnabled"
                     checked={config.autoSleepEnabled} onChange={handleChange} />
              Bật chế độ Tự động ngủ khi rời đi (Auto-Sleep)
            </label>
          </div>

          <div className="form-group">
            <label>Ngưỡng khoảng cách an toàn (cm):</label>
            <div className="range-inputs">
              <input type="number" name="distanceThresholdMin"
                     value={config.distanceThresholdMin} onChange={handleChange} min="20" max="60" />
              <span>đến</span>
              <input type="number" name="distanceThresholdMax"
                     value={config.distanceThresholdMax} onChange={handleChange} min="50" max="150" />
            </div>
          </div>

          {!config.autoDimEnabled && (
              <div className="form-group">
                <label>Độ sáng thủ công (%): {config.manualLightLevel}</label>
                <input type="range" name="manualLightLevel"
                       value={config.manualLightLevel} onChange={handleChange} min="0" max="100" />
              </div>
          )}

          {config.autoSleepEnabled && (
              <div className="form-group">
                <label>Thời gian chờ trước khi ngủ (phút):</label>
                <input type="number" name="sleepTimeoutMins"
                       value={config.sleepTimeoutMins} onChange={handleChange} min="1" max="30" />
              </div>
          )}

          <button type="submit" className="btn-save">💾 Lưu Cấu Hình</button>
        </form>
      </div>
  );
};

export default Settings;