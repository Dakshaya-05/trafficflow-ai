package com.trafficflow.controller;

import com.trafficflow.dto.SimulationTickResponseDto;
import com.trafficflow.service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/tick")
    public ResponseEntity<SimulationTickResponseDto> runTick() {
        return ResponseEntity.ok(simulationService.triggerTick());
    }
}
