package com.hcmut.backend.service;

import com.hcmut.backend.model.User;
import com.hcmut.backend.model.UserConfig;
import com.hcmut.backend.repository.UserConfigRepository;
import com.hcmut.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class UserConfigService {

    @Autowired
    private UserConfigRepository userConfigRepository;

    @Autowired
    private RedisTemplate<String, Object>  redisTemplate;

    @Autowired
    private UserRepository userRepository;

    public UserConfig getUserConfig(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản!"));

        return userConfigRepository.findById(user.getId()).orElseGet(() -> {
            UserConfig newConfig = new UserConfig();

            newConfig.setUser(user);
            newConfig.setDistanceThresholdMin(40);
            newConfig.setDistanceThresholdMax(70);
            newConfig.setAutoDimEnabled(true);
            newConfig.setManualLightLevel(50);
            newConfig.setAutoSleepEnabled(true);
            newConfig.setSleepTimeoutMins(3);

            return newConfig;
        });
    }

    @Transactional
    public UserConfig updateUserConfig(String username, UserConfig configData) {
        UserConfig existingConfig = getUserConfig(username);

        existingConfig.setDistanceThresholdMin(configData.getDistanceThresholdMin());
        existingConfig.setDistanceThresholdMax(configData.getDistanceThresholdMax());
        existingConfig.setAutoDimEnabled(configData.getAutoDimEnabled());
        existingConfig.setManualLightLevel(configData.getManualLightLevel());
        existingConfig.setAutoSleepEnabled(configData.getAutoSleepEnabled());
        existingConfig.setSleepTimeoutMins(configData.getSleepTimeoutMins());

        return userConfigRepository.save(existingConfig);
    }

    public UserConfig getGuestConfig(String guestId){
        Object cachedData = redisTemplate.opsForValue().get(guestId);
        if (cachedData != null){
            return (UserConfig) cachedData;
        }

        UserConfig defaultGuestWs = new UserConfig();

        defaultGuestWs.setDistanceThresholdMin(40);
        defaultGuestWs.setDistanceThresholdMax(70);
        defaultGuestWs.setAutoDimEnabled(true);
        defaultGuestWs.setManualLightLevel(50);
        defaultGuestWs.setAutoSleepEnabled(true);
        defaultGuestWs.setSleepTimeoutMins(3);

        return defaultGuestWs;
    }

    public UserConfig updateGuestConfig(String guestId, UserConfig configData) {
        redisTemplate.opsForValue().set(guestId, configData, 7, TimeUnit.DAYS);
        return configData;
    }

    @Transactional
    public void transferGuestConfigToUser(String guestId, String username){
        if (guestId == null || !guestId.startsWith("guest_")) return;


        Object cachedData = redisTemplate.opsForValue().get(guestId);
        if (cachedData != null){
            UserConfig guestWs = (UserConfig) cachedData;

            UserConfig userWs = getUserConfig(username);

            userWs.setDistanceThresholdMin(guestWs.getDistanceThresholdMin());
            userWs.setDistanceThresholdMax(guestWs.getDistanceThresholdMax());
            userWs.setAutoDimEnabled(guestWs.getAutoDimEnabled());
            userWs.setManualLightLevel(guestWs.getManualLightLevel());
            userWs.setAutoSleepEnabled(guestWs.getAutoSleepEnabled());
            userWs.setSleepTimeoutMins(guestWs.getSleepTimeoutMins());

            userConfigRepository.save(userWs);

            redisTemplate.delete(guestId);
            System.out.println(guestId + " thành" + username);
        }
    }
}
