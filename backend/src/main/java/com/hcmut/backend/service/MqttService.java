package com.hcmut.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcmut.backend.model.Device;
import com.hcmut.backend.model.HistoryLog;
import com.hcmut.backend.repository.DeviceRepository;
import com.hcmut.backend.repository.HistoryLogRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MqttService {

    @Value("${mqtt.broker.url}")
    private String brokerUrl;

    @Value("${mqtt.client.id}")
    private String clientId;

    private MqttClient client;
    private final ObjectMapper objectMapper = new ObjectMapper(); // Để parse JSON

    // Tiêm repository để lưu DB
    private final HistoryLogRepository historyLogRepository;
    private final DeviceRepository deviceRepository;

    @PostConstruct
    public void init() {
        try {
            client = new MqttClient(brokerUrl, clientId);
            MqttConnectOptions options = new MqttConnectOptions();
            options.setAutomaticReconnect(true); // Tự kết nối lại nếu rớt mạng
            options.setCleanSession(true);
            options.setMqttVersion(MqttConnectOptions.MQTT_VERSION_3_1_1);

            options.setConnectionTimeout(10);
            options.setKeepAliveInterval(60);

            client.connect(options);
            System.out.println("Đã kết nối thành công tới MQTT Broker: " + brokerUrl);

            // Đăng ký nghe tất cả tin nhắn từ các máy (Dấu + là đại diện cho mọi MAC Address)
            String topicToListen = "iot/devices/+/sensors";
            client.subscribe(topicToListen, this::handleIncomingMessage);

            System.out.println("Đang lắng nghe dữ liệu cảm biến tại: " + topicToListen);

        } catch (MqttException e) {
            System.err.println("Lỗi kết nối MQTT: " + e.getMessage());
        }
    }

    // Hàm xử lý khi mạch gửi dữ liệu lên
    private void handleIncomingMessage(String topic, MqttMessage message) {
        try {
            String payload = new String(message.getPayload());
            System.out.println("Nhận được từ [" + topic + "]: " + payload);

            // Bóc tách MAC Address từ cái topic (Ví dụ: iot/devices/WS-001/sensors -> lấy WS-001)
            String macAddress = topic.split("/")[2];

            // Chuyển chuỗi JSON thành Object để lấy số liệu
            JsonNode data = objectMapper.readTree(payload);
            int light = data.has("light") ? data.get("light").asInt() : 0;
            int distance = data.has("distance") ? data.get("distance").asInt() : 0;

            // Tìm thiết bị trong DB để biết ai đang ngồi
            deviceRepository.findById(macAddress).ifPresent(device -> {
                // Nếu có người đang ngồi (khác null và không phải guest) thì lưu log
                if (device.getCurrentUser() != null && !device.getCurrentUser().startsWith("guest_")) {
                    HistoryLog log = new HistoryLog();
                    log.setDevice(device);
                    log.setCurrentUserId(device.getCurrentUser());
                    log.setLightValue(light);
                    log.setDistanceValue(distance);
                    historyLogRepository.save(log);
                    System.out.println("Đã lưu HistoryLog cho user: " + device.getCurrentUser());
                }
            });

        } catch (Exception e) {
            System.err.println("Lỗi xử lý tin nhắn: " + e.getMessage());
        }
    }

    // Hàm dùng để gởi lệnh cấu hình xuống mạch
    public void publishConfig(String macAddress, Object configData) {
        try {
            if (client != null && client.isConnected()) {
                String topic = "iot/devices/" + macAddress + "/config";
                String payload = objectMapper.writeValueAsString(configData);

                MqttMessage message = new MqttMessage(payload.getBytes());
                message.setQos(1); // Đảm bảo tin nhắn tới nơi
                client.publish(topic, message);

                System.out.println("Đã gửi lệnh xuống [" + topic + "]: " + payload);
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi MQTT: " + e.getMessage());
        }
    }
}