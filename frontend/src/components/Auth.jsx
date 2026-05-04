import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";
import "../styles/Auth.css"; // Nhúng giao diện xịn vào đây

const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorMsg, setErrorMsg] = useState(''); // State để hiển thị lỗi
    const navigate = useNavigate();

    // Gọi hàm từ context
    const { login, loginAsGuest } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrorMsg(''); // Gõ lại thì tự động xóa thông báo lỗi cũ
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (isLoginMode) {
            try {
                // ĐÃ NỐI API THẬT XUỐNG BACKEND TẠI ĐÂY
                await login(formData.username, formData.password);
                navigate('/dashboard');
            } catch (error) {
                setErrorMsg("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!");
            }
        } else {
            try {
                // GỌI API ĐĂNG KÝ
                await axiosClient.post('/api/auth/register', formData);
                alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
                setIsLoginMode(true); // Đẩy về lại form đăng nhập
                setFormData({ username: '', password: '' }); // Xóa form
            } catch (error) {
                setErrorMsg("Đăng ký thất bại. Tên đăng nhập này có thể đã được sử dụng.");
            }
        }
    };

    const handleGuestClick = () => {
        loginAsGuest();
        navigate('/dashboard');
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2 className="auth-title">
                    {isLoginMode ? 'Đăng nhập Hệ thống' : 'Tạo tài khoản mới'}
                </h2>

                {/* Hiển thị lỗi nếu có */}
                {errorMsg && <div className="error-message">{errorMsg}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên đăng nhập..."
                        />
                    </div>
                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        {isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                </form>

                <div className="auth-switch">
                    <button onClick={() => setIsLoginMode(!isLoginMode)}>
                        {isLoginMode ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                    </button>
                </div>

                <hr className="auth-divider" />

                <button onClick={handleGuestClick} className="btn-guest">
                    Truy cập nhanh (Chế độ Khách)
                </button>
            </div>
        </div>
    );
};

export default Auth;