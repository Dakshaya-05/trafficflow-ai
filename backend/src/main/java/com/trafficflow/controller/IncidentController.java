package com.trafficflow.controller;

import com.trafficflow.dto.IncidentDto;
import com.trafficflow.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public ResponseEntity<List<IncidentDto>> getIncidents(@RequestParam(required = false, defaultValue = "false") boolean all) {
        if (all) {
            return ResponseEntity.ok(incidentService.getAllIncidents());
        }
        return ResponseEntity.ok(incidentService.getActiveIncidents());
    }

    @PostMapping
    public ResponseEntity<IncidentDto> reportIncident(@Valid @RequestBody IncidentDto incidentDto) {
        IncidentDto created = incidentService.createIncident(incidentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
