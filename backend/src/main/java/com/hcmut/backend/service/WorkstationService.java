package com.hcmut.backend.service;

import com.hcmut.backend.model.Workstation;
import com.hcmut.backend.repository.WorkstationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class WorkstationService {

    @Autowired
    private WorkstationRepository workstationRepository;

    @Autowired
    private RedisTemplate<String, Object>  redisTemplate;

    public Workstation getWorkstationConfig(String workstationId){
        Optional<Workstation> workstation = workstationRepository.findById(workstationId);

        return workstation.orElseGet(() -> {
            Workstation new_workstation = new Workstation();
            new_workstation.setId(workstationId);
            new_workstation.setDistanceThresholdMin(40);
            new_workstation.setDistanceThresholdMax(70);

            return new_workstation;
        });
    }

    @Transactional
    public Workstation updateConfig(String workstationId, Workstation configData) {
        Workstation existingWs = getWorkstationConfig(workstationId);

        existingWs.setDistanceThresholdMin(configData.getDistanceThresholdMin());
        existingWs.setDistanceThresholdMax(configData.getDistanceThresholdMax());
        existingWs.setAutoDimEnabled(configData.getAutoDimEnabled());
        existingWs.setManualLightLevel(configData.getManualLightLevel());
        existingWs.setAutoSleepEnabled(configData.getAutoSleepEnabled());
        existingWs.setSleepTimeoutMins(configData.getSleepTimeoutMins());

        return workstationRepository.save(existingWs);
    }

    public Workstation getGuestConfig(String guestId){
        Object cachedData = redisTemplate.opsForValue().get(guestId);
        if (cachedData != null){
            return (Workstation) cachedData;
        }

        Workstation defaultGuestWs = new Workstation();

        defaultGuestWs.setId(guestId);
        defaultGuestWs.setDistanceThresholdMin(40);
        defaultGuestWs.setDistanceThresholdMax(70);
        defaultGuestWs.setAutoDimEnabled(true);
        defaultGuestWs.setManualLightLevel(50);
        defaultGuestWs.setAutoSleepEnabled(true);
        defaultGuestWs.setSleepTimeoutMins(3);

        return defaultGuestWs;
    }

    public Workstation updateGuestConfig(String guestId, Workstation configData) {
        redisTemplate.opsForValue().set(guestId, configData, 7, TimeUnit.DAYS);
        return configData;
    }

    @Transactional
    public void transferGuestConfigToUser(String guestId, String username){
        if (guestId == null || !guestId.startsWith("guest_")) return;


        Object cachedData = redisTemplate.opsForValue().get(guestId);
        if (cachedData != null){
            Workstation guestWs = (Workstation) cachedData;

            Workstation userWs = getWorkstationConfig(username);

            userWs.setDistanceThresholdMin(guestWs.getDistanceThresholdMin());
            userWs.setDistanceThresholdMax(guestWs.getDistanceThresholdMax());
            userWs.setAutoDimEnabled(guestWs.getAutoDimEnabled());
            userWs.setManualLightLevel(guestWs.getManualLightLevel());
            userWs.setAutoSleepEnabled(guestWs.getAutoSleepEnabled());
            userWs.setSleepTimeoutMins(guestWs.getSleepTimeoutMins());

            workstationRepository.save(userWs);

            redisTemplate.delete(guestId);
            System.out.println(guestId + " thành" + username);
        }
    }
}
