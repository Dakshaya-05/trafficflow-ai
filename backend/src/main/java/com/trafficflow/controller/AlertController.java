package com.trafficflow.controller;

import com.trafficflow.model.Alert;
import com.trafficflow.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<Alert>> getActiveAlerts() {
        return ResponseEntity.ok(alertService.getActiveAlerts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> dismissAlert(@PathVariable Long id) {
        boolean dismissed = alertService.dismissAlert(id);
        if (dismissed) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Alert dismissed successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
