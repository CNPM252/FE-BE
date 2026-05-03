import React, { useState, useEffect, useRef } from 'react';
import '../styles/UserProfile.css';

const UserProfile = ({onLogout}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // State lưu thông tin user.
    const [userInfo, setUserInfo] = useState({
        username: 'Đang tải...',
        inAppName: 'Đang tải...',
        macAddress: 'Chưa kết nối'
    });

    useEffect(() => {
        fetchUserInfo();

        // Bắt sự kiện click ra ngoài để đóng Card
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUserInfo = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // TODO: API GET /api/users/me
            // hard-code
            setUserInfo({
                username: '2410001',
                inAppName: 'Nguyên Phan Châu',
                macAddress: 'WS-001'
            });
        } catch (error) {
            console.error("Lỗi lấy thông tin User:", error);
        }
    };

    const handleSignOut = () => {
        // Xóa JWT token khỏi Local Storage
        localStorage.removeItem('token');
        // Chuyển hướng về trang Login
        window.location.href = '/login';
    };

    return (
        <div className="user-profile-container" ref={dropdownRef}>
            {/* Vùng bấm để mở Avatar */}
            <div className="avatar-wrapper" onClick={() => setIsOpen(!isOpen)}>
                <img
                    // Dùng DiceBear API để sinh avatar tự động dựa theo Username
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${userInfo.username}`}
                    alt="User Avatar"
                    className="avatar-img"
                />
            </div>

            {/* Thẻ Card thả xuống */}
            {isOpen && (
                <div className="profile-dropdown-card">
                    <div className="profile-header">
                        <h4>{userInfo.inAppName}</h4>
                        <p className="username">@{userInfo.username}</p>
                    </div>

                    <div className="profile-body">
                        <div className="device-info">
                            <span className="device-label"> Thiết bị hiện tại:</span>
                            <span className={`device-mac ${userInfo.macAddress !== 'Chưa kết nối' ? 'connected' : ''}`}>
                                {userInfo.macAddress}
                            </span>
                        </div>
                    </div>

                    <div className="profile-footer">
                        <button className="btn-signout" onClick={onLogout}>
                            🚪 Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;