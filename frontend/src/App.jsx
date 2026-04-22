import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import Auth from './components/Auth'
import './styles/global.css'


function App() {

const [activeTab, setActiveTab] = useState('dashboard');

  const hasToken = localStorage.getItem('token') !== null;
  const isGuest = localStorage.getItem('guestMode') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
    // Xóa luôn ID của Guest để lần sau vào tạo phiên làm việc mới
    // localStorage.removeItem('workstationId');
    window.location.reload();
  };

if (!hasToken && !isGuest) {
  return <Auth/>
}

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto">

        <div className="max-w-2xl mx-auto flex justify-end mb-4">
          <button
              onClick={handleLogout}
              className="text-sm font-bold text-red-500 hover:text-red-700 hover:underline"
          >
            {hasToken ? 'Đăng xuất tài khoản' : 'Thoát chế độ Khách'}
          </button>
        </div>
        
        {/* Nút chuyển đổi (Toggle) */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 p-1 rounded-lg inline-flex">
            <button 
              className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white shadow' : 'text-gray-600'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'settings' ? 'bg-white shadow' : 'text-gray-600'}`}
              onClick={() => setActiveTab('settings')}
            >
              Cài đặt
            </button>
          </div>
        </div>

        
        {activeTab === 'dashboard' ? <Dashboard /> : <Settings />}

      </div>
    </div>
  );
}

export default App
