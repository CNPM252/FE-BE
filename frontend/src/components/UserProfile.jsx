import { useState, useEffect, useRef } from 'react';

export default function UserProfile({ onLogout, isGuest }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [userInfo, setUserInfo] = useState({
        username: isGuest ? 'Guest' : 'Đang tải...',
        inAppName: isGuest ? 'Khách viếng thăm' : 'Đang tải...',
        macAddress: import.meta.env.VITE_DEVICE_MAC || 'WS-001'
    });

    useEffect(() => {
        // Tạm thời mock data cho giao diện. Sau này bạn có thể fetch từ /api/users/me
        if (!isGuest) {
            setUserInfo(prev => ({
                ...prev,
                username: '2410001',
                inAppName: 'Nguyên Phan Châu'
            }));
        }

        // Xử lý click ra ngoài để đóng menu
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isGuest]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Nút Avatar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-gray-200 bg-gray-50 hover:border-blue-500 hover:shadow-md transition-all focus:outline-none overflow-hidden"
            >
                <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${userInfo.username}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                />
            </button>

            {/* Dropdown Card */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 transform origin-top-right transition-all">
                    {/* Header: Thông tin User */}
                    <div className="p-4 bg-gray-50 rounded-t-xl border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-800 truncate">{userInfo.inAppName}</p>
                        <p className="text-xs text-gray-500 truncate">@{userInfo.username}</p>
                    </div>

                    {/* Body: Thông tin thiết bị */}
                    <div className="p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Thiết bị kết nối
                        </p>
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm font-bold text-gray-700">{userInfo.macAddress}</span>
                        </div>
                    </div>

                    {/* Footer: Nút Đăng xuất */}
                    <div className="p-3 border-t border-gray-100">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg font-bold transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            {isGuest ? 'Thoát chế độ Khách' : 'Đăng xuất'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}