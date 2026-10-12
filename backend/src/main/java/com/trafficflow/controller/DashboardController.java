package com.trafficflow.controller;

import com.trafficflow.dto.DashboardStatsDto;
import com.trafficflow.service.TrafficRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TrafficRecordService trafficRecordService;

    public DashboardController(TrafficRecordService trafficRecordService) {
        this.trafficRecordService = trafficRecordService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = trafficRecordService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
