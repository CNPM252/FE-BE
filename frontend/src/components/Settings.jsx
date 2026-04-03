import { useState } from 'react';


export default function Settings() {
  const [config, setConfig] = useState({
    minDistance: 40,
    maxDistance: 70,
    autoDim: true,
    manualLightLevel: 50,
    autoSleep: true,
    sleepTimeout: 3
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setConfig({ ...config, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Dữ liệu gửi lên API: ", config);
    alert("Đã lưu cấu hình thành công!");
  };

return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Cấu hình hệ thống</h2>
      
      <form onSubmit={handleSave} className="space-y-6">

        {/* nút auto đo khoảng cách */}
        <div classname="grid grid-cols-1 gap-4">
            <div>
                <button type="button" className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Tìm khoảng cách tự động</button>
            </div>
        </div>
        
        {/* Nhóm 1: Khoảng cách */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Khoảng cách gần nhất (cm)</label>
            <input type="number" name="minDistance" value={config.minDistance} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Khoảng cách xa nhất (cm)</label>
            <input type="number" name="maxDistance" value={config.maxDistance} onChange={handleChange} className="w-full border border-gray-300 p-2 rounded-md" />
          </div>
        </div>

        {/* Nhóm 2: Điều khiển Ánh sáng */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" name="autoDim" checked={config.autoDim} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
            <span className="font-medium">Auto-dim (Tự động điều chỉnh độ sáng)</span>
          </label>

          {/* HIỆN THANH TRƯỢT KHI AUTO-DIM BỊ TẮT */}
          {!config.autoDim && (
            <div className="pl-8 pt-2 transition-all">
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
            <input type="checkbox" name="autoSleep" checked={config.autoSleep} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
            <span className="font-medium">Auto-sleep (Tự động tắt khi vắng mặt)</span>
          </label>

          {/* HIỆN Ô NHẬP THỜI GIAN KHI AUTO-SLEEP BẬT */}
          {config.autoSleep && (
            <div className="pl-8 pt-2 transition-all">
              <label className="block text-sm font-medium mb-1">Thời gian chờ trước khi Sleep (phút)</label>
              <input type="number" name="sleepTimeout" value={config.sleepTimeout} onChange={handleChange} className="w-48 border border-gray-300 p-2 rounded-md" />
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-bold mt-4 hover:bg-blue-700 transition">
          Lưu Cài Đặt
        </button>
      </form>
    </div>
  );
}