package com.hcmut.backend.config;

import com.hcmut.backend.model.Device;
import com.hcmut.backend.repository.DeviceRepository;
import com.hcmut.backend.model.User;
import com.hcmut.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (deviceRepository.count() == 0) {
            System.out.println("Tạo Mac device giả");

            Device dev1 = new Device();
            dev1.setMacAddress("WS-001");
            dev1.setActive(true);

            Device dev2 = new Device();
            dev2.setMacAddress("WS-002");
            dev2.setActive(false);

            deviceRepository.save(dev1);
            deviceRepository.save(dev2);

            System.out.println("tạo WS-001 và WS-002!");


            if (userRepository.findByUsername("admin").isEmpty()) {

                System.out.println("Tạo tài khoản Admin mặc định...");

                User admin = new User();
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123")); // Mã hóa mật khẩu
                admin.setRole("ROLE_ADMIN");
                admin.setInAppName("Quản Trị Viên");

                userRepository.save(admin);

                System.out.println("🚀 Đã tạo tài khoản Admin! (User: admin | Pass: admin123)");
            }
        }
    }
}