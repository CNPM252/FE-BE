import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Plus, Map, Trash2, ShieldAlert, MonitorUp, X, RefreshCw } from 'lucide-react';

// Danh sách MAC ảo để test trong lúc chờ thiết bị IOT thật
const MOCK_MAC_ADDRESSES = [
    'MAC-101', 'MAC-102', 'MAC-103', 'MAC-104', 'MAC-105',
    'AC:12:34:56:78:90', 'B8:27:EB:00:11:22', '00:14:22:01:23:45',
    'F0:E1:D2:C3:B4:A5', 'AA:BB:CC:DD:EE:FF'
];

const Rooms = () => {
    const { user, isGuest } = useAuth();
    const navigate = useNavigate();

    // States cho danh sách phòng
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // States cho Modal Tạo Phòng
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRoomData, setNewRoomData] = useState({ name: '', roomCode: '' });

    // States cho Modal Thêm Máy (Auto-Join)
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [devicePayload, setDevicePayload] = useState({ macAddress: '', roomCode: '' });

    const currentUsername = user?.id || user?.username;

    // Tải danh sách phòng
    useEffect(() => {
        if (isGuest || !currentUsername) return;
        fetchRooms();
    }, [isGuest, currentUsername]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/rooms', {
                params: { owner: currentUsername }
            });
            setRooms(response.data);
        } catch (error) {
            console.error("Lỗi tải danh sách không gian:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/rooms', {
                ...newRoomData,
                ownerUsername: currentUsername
            });
            setShowCreateModal(false);
            setNewRoomData({ name: '', roomCode: '' });
            fetchRooms();
        } catch (error) {
            alert(error.response?.data || "Lỗi khi tạo phòng!");
        }
    };

    const handleDeleteRoom = async (e, roomId) => {
        e.stopPropagation();
        if (!window.confirm("Bạn có chắc chắn muốn xóa không gian này? Mọi thiết bị bên trong sẽ bị mất liên kết!")) return;

        try {
            await axiosClient.delete(`/api/rooms/${roomId}`);
            setRooms(rooms.filter(r => r.id !== roomId));
        } catch (error) {
            alert("Lỗi khi xóa phòng!");
        }
    };

    // MỞ MODAL VÀ TẠO MAC NGẪU NHIÊN
    const handleOpenDeviceModal = () => {
        const randomMac = MOCK_MAC_ADDRESSES[Math.floor(Math.random() * MOCK_MAC_ADDRESSES.length)];
        setDevicePayload({ macAddress: randomMac, roomCode: '' });
        setShowDeviceModal(true);
    };

    // Đổi MAC ngẫu nhiên khác (nếu người dùng muốn test máy khác)
    const handleRefreshMac = () => {
        const randomMac = MOCK_MAC_ADDRESSES[Math.floor(Math.random() * MOCK_MAC_ADDRESSES.length)];
        setDevicePayload({ ...devicePayload, macAddress: randomMac });
    };

    const handleAddDevice = async (e) => {
        e.preventDefault();
        if (!devicePayload.macAddress || !devicePayload.roomCode.trim()) {
            alert("Vui lòng nhập đầy đủ Mã phòng!");
            return;
        }

        try {
            const response = await axiosClient.post('/api/devices/auto-join', devicePayload);
            alert(response.data);
            setShowDeviceModal(false);
        } catch (error) {
            alert(error.response?.data || "Lỗi khi thêm máy! Vui lòng kiểm tra lại Mã phòng.");
        }
    };

    if (isGuest) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <ShieldAlert size={64} className="text-orange-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Truy cập bị từ chối</h2>
                <p className="text-gray-500 mt-2">Chế độ Khách không thể xem hoặc quản lý Không gian.</p>
            </div>
        );
    }

    return (
        <div className="p-4 h-full flex flex-col relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Không gian</h2>
                    <p className="text-sm text-gray-500 mt-1">Danh sách các phòng máy / không gian bạn đang quản lý.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleOpenDeviceModal}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center font-bold text-sm shadow-sm"
                    >
                        <MonitorUp size={18} className="mr-2" /> Thêm máy
                    </button>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center font-bold text-sm shadow-sm"
                    >
                        <Plus size={18} className="mr-2" /> Tạo phòng mới
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-gray-400 font-medium animate-pulse">Đang tải dữ liệu...</p>
                </div>
            ) : rooms.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                    <Map size={48} className="mb-4 text-gray-300" />
                    <p>Bạn chưa có không gian nào. Hãy tạo một phòng mới!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map(room => (
                        <div
                            key={room.id}
                            onClick={() => navigate(`/rooms/${room.id}`)}
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                    <Map size={24} />
                                </div>
                                <button
                                    onClick={(e) => handleDeleteRoom(e, room.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                    title="Xóa phòng"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">{room.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Mã tham gia: <span className="font-semibold text-gray-700">{room.roomCode}</span></p>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL THÊM MÁY (AUTO-JOIN) */}
            {showDeviceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <MonitorUp size={18} className="mr-2 text-green-600" /> Thêm máy vào phòng
                            </h3>
                            <button onClick={() => setShowDeviceModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddDevice} className="p-5">
                            <div className="mb-4">
                                <label className="flex justify-between text-sm font-bold text-gray-700 mb-1">
                                    <span>Địa chỉ MAC (Tự động nhận diện)</span>
                                    <button type="button" onClick={handleRefreshMac} className="text-blue-500 hover:text-blue-700 flex items-center text-xs">
                                        <RefreshCw size={12} className="mr-1" /> Đổi MAC Test
                                    </button>
                                </label>
                                {/* INPUT MAC ADDRESS ĐÃ ĐƯỢC KHÓA CHẾT VÀ TÔ XÁM */}
                                <input
                                    type="text"
                                    readOnly
                                    value={devicePayload.macAddress}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-100 text-gray-500 cursor-not-allowed font-mono outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1 italic">*Test: Mã MAC được tạo ngẫu nhiên.</p>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mã Phòng (Room Code)</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    placeholder="Mã phòng muốn đưa máy vào..."
                                    value={devicePayload.roomCode}
                                    onChange={(e) => setDevicePayload({...devicePayload, roomCode: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-green-200 font-bold"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowDeviceModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">
                                    Hủy
                                </button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white font-bold hover:bg-green-700 rounded-lg">
                                    Liên kết máy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL TẠO PHÒNG CŨ */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-800 flex items-center">
                                <Plus size={18} className="mr-2 text-blue-600" /> Tạo Không gian mới
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateRoom} className="p-5">
                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên Không gian</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: Phòng máy H6-201"
                                    value={newRoomData.name}
                                    onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mã tham gia (Room Code)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="VD: 123456"
                                    value={newRoomData.roomCode}
                                    onChange={(e) => setNewRoomData({...newRoomData, roomCode: e.target.value})}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-200"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">
                                    Hủy
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-lg">
                                    Tạo mới
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