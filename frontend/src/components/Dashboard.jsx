import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dữ liệu mẫu (Sau này bạn sẽ gọi API để lấy dữ liệu thật)
const dataWeek = [
  { name: 'T2', hours: 3 }, { name: 'T3', hours: 4.5 }, { name: 'T4', hours: 2 },
  { name: 'T5', hours: 5 }, { name: 'T6', hours: 4.2 }, { name: 'T7', hours: 1 }, { name: 'CN', hours: 0 }
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('week');

  return (
      <div className="space-y-6">
        {/* 4 Thẻ chỉ số (KPI Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Đã ngồi hôm nay</p>
            <p className="text-2xl font-bold text-blue-600">4.2 giờ</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Tỷ lệ tư thế chuẩn</p>
            <p className="text-2xl font-bold text-green-600">85%</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Khoảng cách thường giữ</p>
            <p className="text-2xl font-bold text-purple-600">45 cm</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Tài nguyên tiết kiệm</p>
            <p className="text-2xl font-bold text-orange-600">2.5 giờ</p>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Thống kê thời gian ngồi</h2>
            <select
                className="border p-2 rounded-md"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataWeek}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
  );
}