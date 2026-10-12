package com.trafficflow.controller;

import com.trafficflow.dto.PredictionResponseDto;
import com.trafficflow.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping
    public ResponseEntity<List<PredictionResponseDto>> getPredictions() {
        return ResponseEntity.ok(predictionService.getLatestPredictions());
    }

    @GetMapping("/{roadId}")
    public ResponseEntity<List<PredictionResponseDto>> getPredictionsForRoad(@PathVariable Long roadId) {
        return ResponseEntity.ok(predictionService.getPredictionsForRoad(roadId));
    }

    @PostMapping
    public ResponseEntity<PredictionResponseDto> createPrediction(@RequestBody Map<String, Object> body) {
        Long roadId = Long.valueOf(body.get("roadId").toString());
        Integer window = body.containsKey("predictionWindowMinutes") ?
                Integer.valueOf(body.get("predictionWindowMinutes").toString()) : 30;
        return ResponseEntity.ok(predictionService.generatePredictionForRoad(roadId, window));
    }
}
