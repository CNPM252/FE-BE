Thông tin chung
Giao thức: MQTT v3.1.1

Định dạng: JSON

Quy ước ID: {macAddress} (Ví dụ: WS-001, WS-002)

1. Chiều Cảm biến (Uplink)
Mục đích: Yolo:bit gửi dữ liệu lên Server để lưu log và vẽ biểu đồ.

Topic: iot/devices/{macAddress}/sensors

Payload:

JSON
{
"light": 85,
"distance": 45
}
Giải thích:

light: Độ sáng môi trường (0-100%).

distance: Khoảng cách người dùng (cm).

2. Chiều Điều khiển (Downlink)
Mục đích: Server gửi cấu hình xuống để Yolo:bit điều khiển thiết bị.

Topic: iot/devices/{macAddress}/config

Payload:

JSON
{
"autoDimEnabled": false,
"manualLightLevel": 85,
"autoSleepEnabled": true,
"sleepTimeoutMins": 3,
"distanceThresholdMin": 40,
"distanceThresholdMax": 70
}
Giải thích:

autoDimEnabled: Bật/tắt tự động điều chỉnh độ sáng.

manualLightLevel: Mức sáng thủ công (nếu không tự động).

autoSleepEnabled: Tự động tắt đèn khi không có người.

distanceThresholdMin/Max: Khoảng cách để xác định có người đang ngồi.