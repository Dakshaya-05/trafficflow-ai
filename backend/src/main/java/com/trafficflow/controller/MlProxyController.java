package com.trafficflow.controller;

import com.trafficflow.client.MlServiceClient;
import com.trafficflow.dto.PredictionRequestDto;
import com.trafficflow.dto.PredictionResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
public class MlProxyController {

    private final MlServiceClient mlServiceClient;

    public MlProxyController(MlServiceClient mlServiceClient) {
        this.mlServiceClient = mlServiceClient;
    }

    @PostMapping("/predict")
    public ResponseEntity<PredictionResponseDto> predict(@Valid @RequestBody PredictionRequestDto requestDto) {
        return ResponseEntity.ok(mlServiceClient.predict(requestDto));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(mlServiceClient.getMetrics());
    }
}
