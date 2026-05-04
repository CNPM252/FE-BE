import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Settings as SettingsIcon, LogOut, User, Map } from 'lucide-react';
import '../styles/MainLayout.css';

const MainLayout = () => {
    const { user, isGuest, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            {/* Thanh Sidebar bên trái */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>BKWorkspace</h2>
                    <span className="badge">{isGuest ? 'Guest Mode' : 'Workspace'}</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <LayoutDashboard size={20} />
                        <span>Tổng quan</span>
                    </NavLink>

                    {/* Thêm Menu Quản lý Không gian */}
                    <NavLink to="/rooms" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <Map size={20} />
                        <span>Không gian</span>
                    </NavLink>

                    <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <SettingsIcon size={20} />
                        <span>Cấu hình</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    {!isGuest && user && (
                        <div className="user-info">
                            <User size={18} />
                            <span>{user.username || 'Người dùng'}</span>
                        </div>
                    )}
                    <button onClick={handleLogout} className="btn-logout">
                        <LogOut size={18} />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Nội dung chính thay đổi ở đây */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;