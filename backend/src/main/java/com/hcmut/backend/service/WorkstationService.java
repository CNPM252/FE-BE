package com.hcmut.backend.service;

import com.hcmut.backend.model.Workstation;
import com.hcmut.backend.repository.WorkstationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WorkstationService {

    @Autowired
    private WorkstationRepository workstationRepository;

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

    public Workstation updateConfig(String workstationId, Workstation configData) {
        Workstation existingWs = getWorkstationConfig(workstationId);

        existingWs.setDistanceThresholdMin(configData.getDistanceThresholdMin());
        existingWs.setDistanceThresholdMax(configData.getDistanceThresholdMax());
        existingWs.setAutoDimEnabled(configData.isAutoDimEnabled());
        existingWs.setManualLightLevel(configData.getManualLightLevel());
        existingWs.setAutoSleepEnabled(configData.isAutoSleepEnabled());
        existingWs.setSleepTimeoutMins(configData.getSleepTimeoutMins());

        return workstationRepository.save(existingWs);
    }
}
