package com.hcmut.backend.service;

import com.hcmut.backend.model.Device;
import com.hcmut.backend.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    @Transactional
    public void checkIn(String macAddress, String userId) {
        Device device = deviceRepository.findById(macAddress)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị: " + macAddress));

        // Cập nhật trạng thái máy
        device.setCurrentUser(userId);
        device.setActive(true);
        deviceRepository.save(device);

        System.out.println("USER [" + userId + "] đã check-in tại thiết bị [" + macAddress + "]");
    }

    @Transactional
    public void checkOut(String macAddress) {
        Device device = deviceRepository.findById(macAddress)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị: " + macAddress));

        // Giải phóng máy
        device.setCurrentUser(null);
        device.setActive(false);
        deviceRepository.save(device);

        System.out.println("Thiết bị [" + macAddress + "] đã trống.");
    }
}