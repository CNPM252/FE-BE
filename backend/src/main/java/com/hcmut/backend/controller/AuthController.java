package com.hcmut.backend.controller;

import com.hcmut.backend.model.User;
import com.hcmut.backend.repository.UserRepository;
import com.hcmut.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.hcmut.backend.service.UserConfigService;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserConfigService workstationService;

    // 1. API ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user, @RequestParam(required = false) String guestId) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username đã tồn tại");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        workstationService.transferGuestConfigToUser(guestId, user.getUsername());
        return ResponseEntity.ok().body("Đăng kí thành công");
    }

    // 2. API ĐĂNG NHẬP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest, @RequestParam(required = false) String guestId) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(loginRequest.getPasswordHash(), userOpt.get().getPasswordHash())) {

            workstationService.transferGuestConfigToUser(guestId, userOpt.get().getUsername());
            String token = jwtUtil.generateToken(userOpt.get());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(401).body("Sai tên đăng nhập hoặc mật khẩu!");
    }
}