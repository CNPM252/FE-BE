import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Đảm bảo đường dẫn đúng

const ProtectedRoute = () => {
  const { user } = useAuth();

  // Nếu chưa đăng nhập, đá về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép truy cập các route con thông qua Outlet
  return <Outlet />;
};

export default ProtectedRoute;