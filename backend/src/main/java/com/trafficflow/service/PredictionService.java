package com.trafficflow.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafficflow.client.MlServiceClient;
import com.trafficflow.dto.PredictionRequestDto;
import com.trafficflow.dto.PredictionResponseDto;
import com.trafficflow.model.*;
import com.trafficflow.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final RoadRepository roadRepository;
    private final TrafficDataRepository trafficDataRepository;
    private final IncidentRepository incidentRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final PublicEventRepository publicEventRepository;
    private final MlServiceClient mlServiceClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PredictionService(PredictionRepository predictionRepository,
                             RoadRepository roadRepository,
                             TrafficDataRepository trafficDataRepository,
                             IncidentRepository incidentRepository,
                             WeatherDataRepository weatherDataRepository,
                             PublicEventRepository publicEventRepository,
                             MlServiceClient mlServiceClient) {
        this.predictionRepository = predictionRepository;
        this.roadRepository = roadRepository;
        this.trafficDataRepository = trafficDataRepository;
        this.incidentRepository = incidentRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.publicEventRepository = publicEventRepository;
        this.mlServiceClient = mlServiceClient;
    }

    public List<PredictionResponseDto> getLatestPredictions() {
        List<Prediction> predictions = predictionRepository.findLatestPredictions();
        List<PredictionResponseDto> results = new ArrayList<>();
        for (Prediction p : predictions) {
            results.add(mapToDto(p));
        }
        return results;
    }

    public List<PredictionResponseDto> getPredictionsForRoad(Long roadId) {
        List<Prediction> predictions = predictionRepository.findLatestByRoadId(roadId);
        List<PredictionResponseDto> results = new ArrayList<>();
        for (Prediction p : predictions) {
            results.add(mapToDto(p));
        }
        return results;
    }

    @Transactional
    public PredictionResponseDto generatePredictionForRoad(Long roadId, Integer windowMinutes) {
        Road road = roadRepository.findById(roadId)
                .orElseThrow(() -> new NoSuchElementException("Road not found: " + roadId));

        TrafficData currentTraffic = trafficDataRepository.findLatestByRoadId(roadId).orElse(null);
        WeatherData weather = weatherDataRepository.findLatest().orElse(null);
        List<Incident> activeIncidents = incidentRepository.findByRoadIdAndStatusNot(roadId, "RESOLVED");

        int currentHour = LocalDateTime.now().getHour();
        int currentDayOfWeek = LocalDateTime.now().getDayOfWeek().getValue() - 1; // 0=Mon, 6=Sun

        PredictionRequestDto requestDto = new PredictionRequestDto();
        requestDto.setRoadId(roadId);
        requestDto.setHour(currentHour);
        requestDto.setDayOfWeek(currentDayOfWeek);
        requestDto.setPredictionWindowMinutes(windowMinutes != null ? windowMinutes : 30);

        if (currentTraffic != null) {
            requestDto.setTrafficVolume(Double.valueOf(currentTraffic.getTrafficVolume()));
            requestDto.setAverageSpeed(currentTraffic.getAverageSpeed());
            requestDto.setHistoricalAverageVolume(Double.valueOf(currentTraffic.getHistoricalAverageVolume()));
            requestDto.setCurrentCongestion(currentTraffic.getCongestionLevel());
        } else {
            requestDto.setTrafficVolume(1100.0);
            requestDto.setAverageSpeed(35.0);
            requestDto.setHistoricalAverageVolume(900.0);
            requestDto.setCurrentCongestion("MODERATE");
        }

        if (weather != null) {
            requestDto.setRainfall(weather.getRainfallMm());
            requestDto.setTemperature(weather.getTemperature());
            requestDto.setRoadCondition(weather.getRoadCondition());
        } else {
            requestDto.setRainfall(0.0);
            requestDto.setTemperature(28.0);
            requestDto.setRoadCondition("DRY");
        }

        requestDto.setAccidentNearby(!activeIncidents.isEmpty());

        // Check if any public events affect this road
        List<PublicEvent> ongoingEvents = publicEventRepository.findByStatusNotOrderByStartTimeAsc("CONCLUDED");
        boolean eventNearby = ongoingEvents.stream()
                .anyMatch(e -> e.getAffectedRoads() != null && e.getAffectedRoads().contains(road.getName()));
        requestDto.setPublicEventNearby(eventNearby);

        // Nearby congestion heuristic
        requestDto.setNearbyCongestion(requestDto.getCurrentCongestion());

        // Call ML prediction service
        PredictionResponseDto responseDto = mlServiceClient.predict(requestDto);
        responseDto.setRoadId(road.getId());
        responseDto.setRoadName(road.getName());

        // Persist prediction in DB
        String factorsJson = "[]";
        try {
            factorsJson = objectMapper.writeValueAsString(responseDto.getFactors());
        } catch (JsonProcessingException ignored) {}

        Prediction entity = new Prediction(
                road,
                responseDto.getPredictionWindowMinutes(),
                responseDto.getPredictedCongestion(),
                responseDto.getRiskScore(),
                responseDto.getConfidence(),
                responseDto.getPredictedSpeed(),
                responseDto.getPredictedVolume(),
                factorsJson,
                responseDto.getExplanation()
        );
        predictionRepository.save(entity);

        return responseDto;
    }

    private PredictionResponseDto mapToDto(Prediction p) {
        PredictionResponseDto dto = new PredictionResponseDto();
        dto.setRoadId(p.getRoad().getId());
        dto.setRoadName(p.getRoad().getName());
        dto.setPredictedCongestion(p.getPredictedCongestion());
        dto.setRiskScore(p.getRiskScore());
        dto.setConfidence(p.getConfidence());
        dto.setPredictionWindowMinutes(p.getPredictionWindowMinutes());
        dto.setPredictedSpeed(p.getPredictedSpeed());
        dto.setPredictedVolume(p.getPredictedVolume());
        dto.setExplanation(p.getExplanation());

        try {
            List<String> factorList = objectMapper.readValue(p.getFactors(), new TypeReference<List<String>>() {});
            dto.setFactors(factorList);
        } catch (Exception e) {
            dto.setFactors(List.of("Historical baseline flow"));
        }

        return dto;
    }
}
