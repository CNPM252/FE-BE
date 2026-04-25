import { useState } from 'react';

export default function Auth() {
    // Trạng thái để biết người dùng đang ở trang Đăng nhập hay Đăng ký
    const [isLogin, setIsLogin] = useState(true);

    // Trạng thái lưu dữ liệu form
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Trạng thái hiển thị thông báo lỗi/thành công
    const [message, setMessage] = useState({type: '', text: ''});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' }); // Xóa thông báo cũ

        const guestId = localStorage.getItem('workstationId');

        const url = isLogin
            ? `http://localhost:8080/api/auth/login${guestId ? `?guestId=${guestId}` : ''}`
            : `http://localhost:8080/api/auth/register${guestId ? `?guestId=${guestId}` : ''}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const dataText = await response.text();

            if (response.ok) {
                if (isLogin) {
                    // LƯU JWT VÀO LOCAL STORAGE KHI ĐĂNG NHẬP THÀNH CÔNG
                    localStorage.setItem('token', dataText);
                    setMessage({ type: 'success', text: 'Đăng nhập thành công!' });

                    // Chờ 1 giây rồi tải lại trang để áp dụng Token
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    // Đăng ký thành công thì tự động chuyển sang form đăng nhập
                    setMessage({ type: 'success', text: 'Đăng ký thành công! Vui lòng đăng nhập.' });
                    setIsLogin(true);
                    setFormData({ ...formData, password: '' }); // Xóa trắng ô password cho an toàn
                }
            } else {
                // Sai mật khẩu hoặc trùng username
                setMessage({ type: 'error', text: dataText || 'Có lỗi xảy ra!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ.' });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {isLogin ? 'Chào mừng bạn quay lại' : 'Bắt đầu quản lý không gian làm việc của bạn'}
                    </p>
                </div>

                {/* Khu vực hiển thị thông báo */}
                {message.text && (
                    <div className={`p-3 mb-4 rounded-md text-sm font-medium ${
                        message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Nhập tên đăng nhập..."
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>

                            {/* NÚT QUÊN MẬT KHẨU (PLACEHOLDER) */}
                            {isLogin && (
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        alert("Tính năng lấy lại mật khẩu đang được phát triển!");
                                    }}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Quên mật khẩu?
                                </a>
                            )}
                        </div>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-95"
                    >
                        {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400">Hoặc</span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        localStorage.setItem('guestMode', 'true');
                        window.location.reload();
                    }}
                    className="w-full bg-white text-gray-700 border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all"
                >
                    Đăng nhập như Khách (Guest)
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setMessage({ type: '', text: '' }); // Xóa lỗi khi chuyển form
                        }}
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {isLogin ? 'Đăng ký ngay' : 'Đăng nhập tại đây'}
                    </button>
                </div>
            </div>
        </div>
    );
}