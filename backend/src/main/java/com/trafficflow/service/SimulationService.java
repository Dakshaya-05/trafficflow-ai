package com.trafficflow.service;

import com.trafficflow.dto.SimulationTickResponseDto;
import com.trafficflow.model.Road;
import com.trafficflow.model.TrafficData;
import com.trafficflow.repository.RoadRepository;
import com.trafficflow.repository.TrafficDataRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class SimulationService {

    private static final Logger log = LoggerFactory.getLogger(SimulationService.class);

    private final RoadRepository roadRepository;
    private final TrafficDataRepository trafficDataRepository;
    private final PredictionService predictionService;
    private final Random random = new Random();

    @Value("${simulation.enabled:true}")
    private boolean simulationEnabled;

    public SimulationService(RoadRepository roadRepository,
                             TrafficDataRepository trafficDataRepository,
                             PredictionService predictionService) {
        this.roadRepository = roadRepository;
        this.trafficDataRepository = trafficDataRepository;
        this.predictionService = predictionService;
    }

    // Runs every 45 seconds if enabled
    @Scheduled(fixedDelay = 45000, initialDelay = 30000)
    public void scheduledSimulationTick() {
        if (!simulationEnabled) return;
        try {
            triggerTick();
        } catch (Exception e) {
            log.warn("Error running scheduled simulation tick: {}", e.getMessage());
        }
    }

    @Transactional
    public SimulationTickResponseDto triggerTick() {
        List<Road> roads = roadRepository.findAll();
        int updatedRoads = 0;
        int updatedPreds = 0;

        for (Road road : roads) {
            TrafficData current = trafficDataRepository.findLatestByRoadId(road.getId()).orElse(null);

            int baseVol = current != null ? current.getTrafficVolume() : 1000;
            double baseSpeed = current != null ? current.getAverageSpeed() : 35.0;

            // Apply realistic delta (-4% to +6%)
            double volumeFactor = 1.0 + (random.nextDouble() * 0.10 - 0.04);
            int newVolume = (int) Math.max(200, Math.min(2600, baseVol * volumeFactor));

            // Adjust speed inversely with volume
            double speedFactor = 1.0 - ((volumeFactor - 1.0) * 0.85);
            double newSpeed = Math.round(Math.max(12.0, Math.min(road.getSpeedLimitKmh(), baseSpeed * speedFactor)) * 10.0) / 10.0;

            // Classify congestion
            int histVol = current != null ? current.getHistoricalAverageVolume() : 900;
            double ratio = (double) newVolume / Math.max(histVol, 1);
            String level;
            if (ratio >= 1.45 || newSpeed < 18.0) level = "SEVERE";
            else if (ratio >= 1.15 || newSpeed < 30.0) level = "HIGH";
            else if (ratio >= 0.85 || newSpeed < 50.0) level = "MODERATE";
            else level = "LOW";

            double occupancy = Math.min(0.98, Math.max(0.20, (double) newVolume / 2200.0));

            TrafficData newRecord = new TrafficData(road, newVolume, newSpeed, level, histVol, occupancy);
            trafficDataRepository.save(newRecord);
            updatedRoads++;

            // Periodically refresh prediction for a subset of roads each tick
            if (random.nextDouble() < 0.35) {
                try {
                    predictionService.generatePredictionForRoad(road.getId(), 30);
                    updatedPreds++;
                } catch (Exception ignored) {}
            }
        }

        log.info("Simulation tick completed: updated {} road traffic states and {} predictions.", updatedRoads, updatedPreds);
        return new SimulationTickResponseDto(true, "Traffic simulation step executed successfully.", updatedRoads, updatedPreds);
    }
}
