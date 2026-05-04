import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedGuest = sessionStorage.getItem('isGuest');

        if (storedToken && storedToken !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                setUser(JSON.parse(storedUser));
            }
        } else if (storedGuest === 'true') {
            setIsGuest(true);
        }
        setLoading(false);
    }, []);

    // Hàm hỗ trợ tìm và lưu MAC Address của trạm (Workstation)
    const resolveMacAddress = () => {
        const params = new URLSearchParams(window.location.search);
        let mac = params.get('mac');

        if (!mac) {
            // Nếu không quét QR, lấy lại mac cũ hoặc dùng tạm máy WS-001 để test
            mac = localStorage.getItem('macAddress') || 'WS-001';
        }

        // Lưu lại để lát nữa Logout còn biết máy nào mà Check-out
        localStorage.setItem('macAddress', mac);
        return mac;
    };

    const login = async (username, password) => {
        try {
            // 1. Gọi API Login
            const res = await axiosClient.post('/api/auth/login', { username, password });
            const token = typeof res.data === 'string' ? res.data : (res.data.token || res.data.accessToken);

            if (!token) throw new Error("Không lấy được Token từ Backend!");

            // 2. Giải mã JWT
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decodedData = JSON.parse(jsonPayload);
            const userData = {
                id: decodedData.sub,
                role: decodedData.role
            };

            // 3. Gọi API CHECK-IN THIẾT BỊ
            const macAddress = resolveMacAddress();
            try {
                // Post body là null, nhét userId vào Query Param (?userId=...)
                await axiosClient.post(`/api/devices/${macAddress}/check-in`, null, {
                    params: { userId: userData.id }
                });
                console.log(`[IoT] Đã Check-in thiết bị ${macAddress} cho user ${userData.id}`);
            } catch (err) {
                console.error("[IoT] Lỗi khi check-in thiết bị:", err);
            }

            // 4. Lưu dữ liệu và cập nhật State
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            setIsGuest(false);
            sessionStorage.removeItem('isGuest');
            return true;
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            throw error;
        }
    };

    const loginAsGuest = async () => {
        sessionStorage.setItem('isGuest', 'true');
        const guestId = 'guest_' + Math.random().toString(36).substring(7);
        sessionStorage.setItem('guestId', guestId);

        // --- GỌI API CHECK-IN CHO GUEST ---
        const macAddress = resolveMacAddress();
        try {
            await axiosClient.post(`/api/devices/${macAddress}/check-in`, null, {
                params: { userId: guestId }
            });
            console.log(`[IoT] Đã Check-in thiết bị ${macAddress} cho GUEST ${guestId}`);
        } catch (err) {
            console.error("[IoT] Lỗi khi check-in thiết bị cho Guest:", err);
        }

        setIsGuest(true);
        setUser(null);
    };

    const logout = async () => {
        // --- GỌI API CHECK-OUT TRƯỚC KHI XÓA DATA TRÌNH DUYỆT ---
        const macAddress = localStorage.getItem('macAddress');
        if (macAddress) {
            try {
                await axiosClient.post(`/api/devices/${macAddress}/check-out`);
                console.log(`[IoT] Đã Check-out giải phóng thiết bị ${macAddress}`);
            } catch (err) {
                console.error("[IoT] Lỗi khi check-out thiết bị:", err);
            }
        }

        // Dọn dẹp bộ nhớ
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('isGuest');
        sessionStorage.removeItem('guestId');

        // Không xóa macAddress trong localStorage vì máy tính vật lý ở phòng lab vẫn cố định ở đó

        setUser(null);
        setIsGuest(false);
    };

    return (
        <AuthContext.Provider value={{ user, isGuest, loading, login, loginAsGuest, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);