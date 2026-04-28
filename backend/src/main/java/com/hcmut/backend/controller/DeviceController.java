package com.hcmut.backend.controller;

import com.hcmut.backend.model.Device;
import com.hcmut.backend.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping("/{macAddress}/check-in")
    public ResponseEntity<?> checkIn(@PathVariable String macAddress, @RequestParam String userId) {
        try {
            deviceService.checkIn(macAddress, userId);
            return ResponseEntity.ok("Check-in thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{macAddress}/check-out")
    public ResponseEntity<?> checkOut(@PathVariable String macAddress) {
        try {
            deviceService.checkOut(macAddress);
            return ResponseEntity.ok("Check-out thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}