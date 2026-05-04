import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { Plus, Trash2, Map, Users, Hash, ShieldAlert } from 'lucide-react';

const Rooms = () => {
    const { user, isGuest } = useAuth(); // Lấy thông tin user từ Context
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoom, setNewRoom] = useState({ name: '', roomCode: '', capacity: 50 });
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // Định danh của User hiện tại
    const currentUsername = user?.id || user?.username;

    // 1. GỌI API: Chỉ lấy danh sách phòng do User này tạo
    const fetchRooms = async () => {
        if (!currentUsername) return;

        try {
            setLoading(true);
            // Gửi params ?owner=username để backend biết đường lọc
            const response = await axiosClient.get('/api/rooms', {
                params: { owner: currentUsername }
            });
            setRooms(response.data);
            setErrorMsg('');
        } catch (error) {
            console.error("Lỗi khi tải danh sách phòng:", error);
            setErrorMsg('Không thể tải danh sách không gian. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Nếu là Guest thì không cần fetch vì Guest không có quyền quản lý phòng
        if (!isGuest && currentUsername) {
            fetchRooms();
        } else {
            setLoading(false);
        }
    }, [isGuest, currentUsername]);

    // 2. GỌI API: Tạo phòng mới (Đính kèm thông tin Owner)
    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            const payload = {
                ...newRoom,
                ownerUsername: currentUsername // Gửi cờ đánh dấu ai là chủ phòng
            };
            await axiosClient.post('/api/rooms', payload);
            setIsModalOpen(false);
            setNewRoom({ name: '', roomCode: '', capacity: 50 });
            fetchRooms();
        } catch (error) {
            console.error("Lỗi tạo phòng:", error);
            setErrorMsg(error.response?.data || 'Có lỗi xảy ra khi tạo phòng!');
        }
    };

    // 3. GỌI API: Xóa phòng
    const handleDeleteRoom = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này? Toàn bộ thiết bị và nhóm bên trong sẽ bị mất.')) {
            return;
        }
        try {
            await axiosClient.delete(`/api/rooms/${id}`);
            fetchRooms();
        } catch (error) {
            console.error("Lỗi xóa phòng:", error);
            alert("Không thể xóa phòng này! Kiểm tra lại quyền của bạn.");
        }
    };

    const handleCardClick = (roomId) => {
        navigate(`/rooms/${roomId}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500 font-medium">Đang đồng bộ dữ liệu không gian...</div>;
    }

    // NẾU LÀ GUEST: Chặn truy cập trang này
    if (isGuest) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <ShieldAlert size={64} className="text-orange-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Truy cập bị từ chối</h2>
                <p className="text-gray-500 mt-2 max-w-md">
                    Tài khoản Khách (Guest) chỉ có thể điều khiển thiết bị cá nhân. Bạn cần đăng ký tài khoản chính thức để tạo và quản lý Không gian/Phòng máy.
                </p>
            </div>
        );
    }

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Không gian quản lý</h2>
                    <p className="text-sm text-gray-500 mt-1">Các phòng máy do bạn tạo và làm chủ.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Tạo phòng mới
                </button>
            </div>

            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 font-medium">
                    {errorMsg}
                </div>
            )}

            {rooms.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Map size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-700">Bạn chưa quản lý phòng nào</h3>
                    <p className="text-gray-500 mt-2 mb-6">Hãy tạo không gian đầu tiên để bắt đầu sắp xếp thiết bị và mời thành viên.</p>
                    <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-bold hover:underline">
                        + Tạo không gian ngay
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            onClick={() => handleCardClick(room.id)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {room.name}
                                </h3>
                                <button
                                    onClick={(e) => handleDeleteRoom(room.id, e)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Xóa phòng"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Hash size={16} className="mr-2 text-gray-400" />
                                    <span>Mã kết nối: <strong className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded ml-1">{room.roomCode}</strong></span>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Users size={16} className="mr-2 text-gray-400" />
                                    <span>Sức chứa: <strong>{room.capacity} thiết bị</strong></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Tạo Phòng */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Tạo không gian mới</h3>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phòng</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoom.name}
                                    onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                                    className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="VD: Phòng H6-201, Team Dev..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã kết nối (Room Code)</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoom.roomCode}
                                    onChange={(e) => setNewRoom({...newRoom, roomCode: e.target.value})}
                                    className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase"
                                    placeholder="VD: H6201"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa dự kiến</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={newRoom.capacity}
                                    onChange={(e) => setNewRoom({...newRoom, capacity: parseInt(e.target.value)})}
                                    className="w-full border border-gray-300 p-2 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Xác nhận tạo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;