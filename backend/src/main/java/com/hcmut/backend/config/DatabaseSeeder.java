package com.hcmut.backend.config;

import com.hcmut.backend.model.Device;
import com.hcmut.backend.repository.DeviceRepository; // Nhớ tạo DeviceRepository nhé
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final DeviceRepository deviceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (deviceRepository.count() == 0) {
            System.out.println("Tạo Mac device giả");

            Device dev1 = new Device();
            dev1.setMacAddress("WS-001");
            dev1.setActive(true);

            Device dev2 = new Device();
            dev2.setMacAddress("WS-002");
            dev2.setActive(true);

            deviceRepository.save(dev1);
            deviceRepository.save(dev2);

            System.out.println("tạo WS-001 và WS-002!");
        }
    }
}