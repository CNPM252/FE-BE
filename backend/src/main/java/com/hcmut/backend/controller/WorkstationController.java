package com.hcmut.backend.controller;

import com.hcmut.backend.model.Workstation;
import com.hcmut.backend.service.WorkstationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/workstations")
@CrossOrigin(origins = "*")
public class WorkstationController {

    @Autowired
    private WorkstationService workstationService;

    @GetMapping("/{workstationId}/config")
    public ResponseEntity<Workstation> getConfig(@PathVariable String workstationId){
        if (workstationId.startsWith("guest_")){
            return ResponseEntity.ok(workstationService.getGuestConfig(workstationId));
        }

        Workstation config = workstationService.getWorkstationConfig(workstationId);
        return ResponseEntity.ok(config);
    }

    @PutMapping("{workstationId}/config")
    public ResponseEntity<Workstation> updateConfig(
            @PathVariable String workstationId,
            @RequestBody Workstation config){
        if (workstationId.startsWith("guest_")){
            return ResponseEntity.ok(workstationService.updateGuestConfig(workstationId, config));
        }

        Workstation updateConfig = workstationService.updateConfig(workstationId, config);
        return ResponseEntity.ok(updateConfig);
    }

}
