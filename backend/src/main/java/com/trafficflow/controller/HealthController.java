package com.trafficflow.controller;

import com.trafficflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final UserRepository userRepository;

    public HealthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "TrafficFlow AI - Spring Boot Backend");
        health.put("version", "1.0.0");
        health.put("timestamp", LocalDateTime.now().toString());

        try {
            long userCount = userRepository.count();
            health.put("database", "CONNECTED (MySQL)");
            health.put("records_healthy", true);
        } catch (Exception ex) {
            health.put("database", "INITIALIZING / DEGRADED: " + ex.getMessage());
            health.put("records_healthy", false);
        }

        return ResponseEntity.ok(health);
    }
}
