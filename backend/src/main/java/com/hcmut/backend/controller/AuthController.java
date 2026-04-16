package com.hcmut.backend.controller;

import com.hcmut.backend.model.User;
import com.hcmut.backend.repository.UserRepository;
import com.hcmut.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 1. API ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Kiểm tra xem username đã bị ai giành chưa
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Tên đăng nhập đã tồn tại!");
        }

        // Băm nát mật khẩu ra để bảo mật trước khi lưu vào Database
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // Mặc định role là USER
        user.setRole("ROLE_USER");

        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // 2. API ĐĂNG NHẬP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(loginRequest.getPasswordHash(), userOpt.get().getPasswordHash())) {

            String token = jwtUtil.generateToken(userOpt.get().getUsername());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu!");
    }
}