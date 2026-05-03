import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import Auth from './components/Auth'
import UserProfile from './components/UserProfile' // Thêm import
import './styles/global.css'

function App() {

  const [activeTab, setActiveTab] = useState('dashboard');

  const hasToken = localStorage.getItem('token') !== null;
  const isGuest = localStorage.getItem('guestMode') === 'true';

  const DEVICE_MAC = import.meta.env.VITE_DEVICE_MAC || 'WS-001';

  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:8080/api/devices/${DEVICE_MAC}/check-out`, {
        method: 'POST'
      });
    } catch (e) {
      console.error("Lỗi check-out", e);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('guestMode');
    window.location.reload();
  };

  if (!hasToken && !isGuest) {
    return <Auth/>
  }

  return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">

          {/* --- HEADER CHỨA AVATAR --- */}
          <div className="max-w-2xl mx-auto flex justify-between items-center mb-6">
            <div className="text-2xl font-black text-gray-800 tracking-tight">
              BK<span className="text-blue-600">Workspace</span>
            </div>

            {/* Gắn UserProfile vào góc phải */}
            <UserProfile onLogout={handleLogout} isGuest={isGuest} />
          </div>

          {/* Nút chuyển đổi (Toggle) */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 p-1 rounded-lg inline-flex">
              <button
                  className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                  className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'settings' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setActiveTab('settings')}
              >
                Cài đặt
              </button>
            </div>
          </div>

          {/* Khu vực Content giữ nguyên */}
          {activeTab === 'dashboard' ? <Dashboard /> : <Settings />}

        </div>
      </div>
  );
}

export default App