import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import './styles/global.css'


function App() {
const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
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
