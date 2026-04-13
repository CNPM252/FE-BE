import { useState, useEffect } from 'react';

export default function Settings() {
  // Trạng thái lưu dữ liệu cấu hình
  const [config, setConfig] = useState({
    minDistance: 40,
    maxDistance: 70,
    autoDimEnabled: true,
    manualLightLevel: 50,
    autoSleepEnabled: true,
    sleepTimeoutMins: 3
  });

  // Trạng thái chờ tải dữ liệu
  const [loading, setLoading] = useState(true);

  // 1. GET API: Tự động chạy khi vừa mở trang Cài đặt
  useEffect(() => {
    fetch('http://localhost:8080/api/workstations/WS-001/config')
        .then(response => response.json())
        .then(data => {
          setConfig(data);
          setLoading(false); // Tắt hiệu ứng loading khi đã có dữ liệu
        })
        .catch(error => {
          console.error("Lỗi khi tải cấu hình từ Backend:", error);
          setLoading(false);
        });
  }, []);

  // Hàm xử lý khi người dùng gõ/kéo thanh trượt
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    // Đảm bảo dữ liệu số được ép kiểu thành Number để tránh lỗi khi gửi xuống DB
    const finalValue = e.target.type === 'number' || e.target.type === 'range' ? Number(value) : value;

    setConfig({ ...config, [e.target.name]: finalValue });
  };

  // 2. PUT API: Chạy khi người dùng bấm nút "Lưu Cài Đặt"
  const handleSave = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/workstations/WS-001/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config), // Biến object thành chuỗi JSON
    })
        .then(response => response.json())
        .then(data => {
          console.log("Server trả về sau khi lưu: ", data);
          alert("Đã lưu cấu hình thành công xuống Database!");
        })
        .catch(error => {
          console.error("Lỗi khi lưu cấu hình:", error);
          alert("Có lỗi kết nối đến máy chủ.");
        });
  };

  if (loading) {
    return <div className="p-8 text-center font-medium text-gray-500">Đang đồng bộ dữ liệu với trạm làm việc...</div>;
  }

  return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Cấu hình hệ thống</h2>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Nhóm 1: Khoảng cách */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Khoảng cách gần nhất (cm)</label>
              <input
                  type="number"
                  name="minDistance"
                  value={config.minDistance}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Khoảng cách xa nhất (cm)</label>
              <input
                  type="number"
                  name="maxDistance"
                  value={config.maxDistance}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Nhóm 2: Điều khiển Ánh sáng */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                  type="checkbox"
                  name="autoDimEnabled"
                  checked={config.autoDimEnabled}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600"
              />
              <span className="font-medium">Auto-dim (Tự động điều chỉnh độ sáng)</span>
            </label>

            {!config.autoDimEnabled && (
                <div className="pl-8 pt-2">
                  <label className="block text-sm font-medium mb-2">
                    Độ sáng thủ công: <span className="text-blue-600 font-bold">{config.manualLightLevel}%</span>
                  </label>
                  <input
                      type="range"
                      name="manualLightLevel"
                      min="0"
                      max="100"
                      value={config.manualLightLevel}
                      onChange={handleChange}
                      className="w-full cursor-pointer accent-blue-600"
                  />
                </div>
            )}
          </div>

          {/* Nhóm 3: Điều khiển Năng lượng */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                  type="checkbox"
                  name="autoSleepEnabled"
                  checked={config.autoSleepEnabled}
                  onChange={handleChange}
                  className="w-5 h-5 accent-blue-600"
              />
              <span className="font-medium">Auto-sleep (Tự động tắt khi vắng mặt)</span>
            </label>

            {config.autoSleepEnabled && (
                <div className="pl-8 pt-2">
                  <label className="block text-sm font-medium mb-1">Thời gian chờ trước khi Sleep (phút)</label>
                  <input
                      type="number"
                      name="sleepTimeoutMins"
                      value={config.sleepTimeoutMins}
                      onChange={handleChange}
                      className="w-48 border border-gray-300 p-2 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
            )}
          </div>

          <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-bold mt-4 hover:bg-blue-700 transition-colors"
          >
            Lưu Cài Đặt
          </button>
        </form>
      </div>
  );
}