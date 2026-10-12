package com.trafficflow.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafficflow.dto.RoadTrafficDto;
import com.trafficflow.model.Incident;
import com.trafficflow.model.Prediction;
import com.trafficflow.model.Road;
import com.trafficflow.model.TrafficData;
import com.trafficflow.repository.IncidentRepository;
import com.trafficflow.repository.PredictionRepository;
import com.trafficflow.repository.RoadRepository;
import com.trafficflow.repository.TrafficDataRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TrafficService {

    private final RoadRepository roadRepository;
    private final TrafficDataRepository trafficDataRepository;
    private final PredictionRepository predictionRepository;
    private final IncidentRepository incidentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TrafficService(RoadRepository roadRepository,
                          TrafficDataRepository trafficDataRepository,
                          PredictionRepository predictionRepository,
                          IncidentRepository incidentRepository) {
        this.roadRepository = roadRepository;
        this.trafficDataRepository = trafficDataRepository;
        this.predictionRepository = predictionRepository;
        this.incidentRepository = incidentRepository;
    }

    public List<Road> getAllRoads() {
        return roadRepository.findAll();
    }

    public Road getRoadById(Long id) {
        return roadRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Road not found with id: " + id));
    }

    public List<TrafficData> getCurrentTraffic() {
        return trafficDataRepository.findLatestTrafficForAllRoads();
    }

    public List<TrafficData> getHistoryForRoad(Long roadId) {
        return trafficDataRepository.findByRoadIdOrderByRecordedAtDesc(roadId);
    }

    public List<RoadTrafficDto> getAllRoadsWithTraffic() {
        List<Road> roads = roadRepository.findAll();
        List<TrafficData> latestTrafficList = trafficDataRepository.findLatestTrafficForAllRoads();
        List<Prediction> latestPredictions = predictionRepository.findLatestPredictions();
        List<Incident> activeIncidents = incidentRepository.findByStatusNotOrderByReportedAtDesc("RESOLVED");

        Map<Long, TrafficData> trafficMap = new HashMap<>();
        for (TrafficData td : latestTrafficList) {
            trafficMap.put(td.getRoad().getId(), td);
        }

        // Map roadId -> prediction with 30 min horizon (or first available)
        Map<Long, Prediction> predictionMap = new HashMap<>();
        for (Prediction p : latestPredictions) {
            Long rId = p.getRoad().getId();
            if (!predictionMap.containsKey(rId) || p.getPredictionWindowMinutes() == 30) {
                predictionMap.put(rId, p);
            }
        }

        Map<Long, List<Incident>> incidentMap = new HashMap<>();
        for (Incident inc : activeIncidents) {
            if (inc.getRoad() != null) {
                incidentMap.computeIfAbsent(inc.getRoad().getId(), k -> new ArrayList<>()).add(inc);
            }
        }

        List<RoadTrafficDto> results = new ArrayList<>();
        for (Road r : roads) {
            TrafficData td = trafficMap.get(r.getId());
            Prediction pred = predictionMap.get(r.getId());
            List<Incident> roadIncs = incidentMap.getOrDefault(r.getId(), Collections.emptyList());

            RoadTrafficDto dto = mapToDto(r, td, pred, roadIncs);
            results.add(dto);
        }

        return results;
    }

    public RoadTrafficDto getRoadTrafficById(Long id) {
        Road r = getRoadById(id);
        TrafficData td = trafficDataRepository.findLatestByRoadId(id).orElse(null);
        List<Prediction> preds = predictionRepository.findLatestByRoadId(id);
        Prediction pred = preds.stream()
                .filter(p -> p.getPredictionWindowMinutes() == 30)
                .findFirst()
                .orElse(preds.isEmpty() ? null : preds.get(0));
        List<Incident> roadIncs = incidentRepository.findByRoadIdAndStatusNot(id, "RESOLVED");

        return mapToDto(r, td, pred, roadIncs);
    }

    private RoadTrafficDto mapToDto(Road r, TrafficData td, Prediction pred, List<Incident> incidents) {
        RoadTrafficDto dto = new RoadTrafficDto();
        dto.setId(r.getId());
        dto.setName(r.getName());
        dto.setCode(r.getCode());
        dto.setStartLocation(r.getStartLocation());
        dto.setEndLocation(r.getEndLocation());
        dto.setLengthKm(r.getLengthKm());
        dto.setSpeedLimitKmh(r.getSpeedLimitKmh());
        dto.setCoordinates(r.getCoordinates());
        dto.setCenterLat(r.getCenterLat());
        dto.setCenterLng(r.getCenterLng());
        dto.setZone(r.getZone());

        if (td != null) {
            dto.setCurrentVolume(td.getTrafficVolume());
            dto.setCurrentSpeed(td.getAverageSpeed());
            dto.setCurrentCongestion(td.getCongestionLevel());
            dto.setHistoricalVolume(td.getHistoricalAverageVolume());
            dto.setOccupancyRate(td.getOccupancyRate());
        } else {
            dto.setCurrentVolume(800);
            dto.setCurrentSpeed(45.0);
            dto.setCurrentCongestion("MODERATE");
            dto.setHistoricalVolume(800);
            dto.setOccupancyRate(0.5);
        }

        if (pred != null) {
            dto.setPredictedCongestion(pred.getPredictedCongestion());
            dto.setRiskScore(pred.getRiskScore());
            dto.setConfidence(pred.getConfidence());
            dto.setPredictionWindowMinutes(pred.getPredictionWindowMinutes());
            dto.setPredictedSpeed(pred.getPredictedSpeed());
            dto.setPredictedVolume(pred.getPredictedVolume());
            dto.setExplanation(pred.getExplanation());
            try {
                List<String> factorList = objectMapper.readValue(pred.getFactors(), new TypeReference<List<String>>() {});
                dto.setFactors(factorList);
            } catch (Exception e) {
                dto.setFactors(List.of("Historical flow profile", "Weather factor"));
            }
        } else {
            dto.setPredictedCongestion(dto.getCurrentCongestion());
            dto.setRiskScore(dto.getCurrentCongestion().equals("HIGH") ? 70.0 : 40.0);
            dto.setConfidence(0.85);
            dto.setPredictionWindowMinutes(30);
            dto.setPredictedSpeed(dto.getCurrentSpeed());
            dto.setPredictedVolume(dto.getCurrentVolume());
            dto.setFactors(List.of("Baseline traffic flow"));
            dto.setExplanation("Predictions are operating normally under standard conditions.");
        }

        dto.setActiveIncidentsCount(incidents.size());
        if (!incidents.isEmpty()) {
            dto.setLatestIncidentDescription(incidents.get(0).getDescription());
        }

        return dto;
    }
}
