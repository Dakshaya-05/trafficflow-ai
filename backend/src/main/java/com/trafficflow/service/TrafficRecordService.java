package com.trafficflow.service;

import com.trafficflow.client.AiPredictorClient;
import com.trafficflow.dto.DashboardStatsDto;
import com.trafficflow.dto.TrafficPredictRequestDto;
import com.trafficflow.dto.TrafficPredictResponseDto;
import com.trafficflow.entity.TrafficRecord;
import com.trafficflow.entity.User;
import com.trafficflow.exception.ResourceNotFoundException;
import com.trafficflow.repository.TrafficRecordRepository;
import com.trafficflow.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrafficRecordService {

    private final TrafficRecordRepository trafficRecordRepository;
    private final UserRepository userRepository;
    private final AiPredictorClient aiPredictionClient;

    public TrafficRecordService(TrafficRecordRepository trafficRecordRepository,
                                UserRepository userRepository,
                                AiPredictorClient aiPredictionClient) {
        this.trafficRecordRepository = trafficRecordRepository;
        this.userRepository = userRepository;
        this.aiPredictionClient = aiPredictionClient;
    }

    @Transactional
    public TrafficPredictResponseDto predictAndSave(TrafficPredictRequestDto requestDto, String username) {
        // AI Model prediction via Python FastAPI service (fails fast with 503 if AI is unavailable)
        TrafficPredictResponseDto aiResult = aiPredictionClient.predict(requestDto);

        User user = null;
        if (username != null && !username.trim().isEmpty()) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        TrafficRecord record = new TrafficRecord(
                requestDto.getLocation(),
                requestDto.getVehicleCount(),
                requestDto.getAverageSpeed(),
                requestDto.getWeatherCondition(),
                requestDto.getTimeOfDay(),
                requestDto.getRoadType(),
                aiResult.getPredictedTrafficLevel(),
                aiResult.getConfidence(),
                aiResult.getRiskScore(),
                aiResult.getRecommendation(),
                user
        );

        TrafficRecord saved = trafficRecordRepository.save(record);

        aiResult.setId(saved.getId());
        aiResult.setLocation(saved.getLocation());
        aiResult.setVehicleCount(saved.getVehicleCount());
        aiResult.setAverageSpeed(saved.getAverageSpeed());
        aiResult.setWeatherCondition(saved.getWeatherCondition());
        aiResult.setTimeOfDay(saved.getTimeOfDay());
        aiResult.setRoadType(saved.getRoadType());
        aiResult.setCreatedAt(saved.getCreatedAt());
        aiResult.setCreatedBy(user != null ? user.getUsername() : "Anonymous / System");

        return aiResult;
    }

    @Transactional(readOnly = true)
    public Page<TrafficPredictResponseDto> getHistory(String search, String level, Pageable pageable) {
        Page<TrafficRecord> recordsPage;

        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasLevel = level != null && !level.trim().isEmpty() && !"ALL".equalsIgnoreCase(level);

        if (hasSearch && hasLevel) {
            recordsPage = trafficRecordRepository.findByLocationContainingIgnoreCaseAndPredictedTrafficLevel(
                    search.trim(), level.trim(), pageable
            );
        } else if (hasSearch) {
            recordsPage = trafficRecordRepository.findByLocationContainingIgnoreCase(search.trim(), pageable);
        } else if (hasLevel) {
            recordsPage = trafficRecordRepository.findByPredictedTrafficLevel(level.trim(), pageable);
        } else {
            recordsPage = trafficRecordRepository.findAll(pageable);
        }

        return recordsPage.map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public TrafficPredictResponseDto getById(Long id) {
        TrafficRecord record = trafficRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Traffic record not found with id: " + id));
        return mapToDto(record);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!trafficRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Traffic record not found with id: " + id);
        }
        trafficRecordRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        long total = trafficRecordRepository.count();
        stats.setTotalRecords(total);

        long lowCount = trafficRecordRepository.countByPredictedTrafficLevel("LOW TRAFFIC");
        long medCount = trafficRecordRepository.countByPredictedTrafficLevel("MEDIUM TRAFFIC");
        long highCount = trafficRecordRepository.countByPredictedTrafficLevel("HIGH TRAFFIC");

        stats.setLowTrafficCount(lowCount);
        stats.setMediumTrafficCount(medCount);
        stats.setHighTrafficCount(highCount);

        Double avgSpeed = trafficRecordRepository.findAverageSpeed();
        stats.setAverageSpeed(avgSpeed != null ? Math.round(avgSpeed * 10.0) / 10.0 : 45.0);

        Long totalVehicles = trafficRecordRepository.findTotalVehicleCount();
        stats.setTotalVehicles(totalVehicles != null ? totalVehicles : 0L);

        stats.setTotalUsers(userRepository.count());

        // Recent predictions
        List<TrafficRecord> recent = trafficRecordRepository.findTop10ByOrderByCreatedAtDesc();
        stats.setRecentPredictions(recent.stream().map(this::mapToDto).collect(Collectors.toList()));

        // Pie chart distribution
        List<Map<String, Object>> distribution = new ArrayList<>();
        distribution.add(Map.of("name", "Low Traffic", "value", lowCount, "color", "#10B981"));
        distribution.add(Map.of("name", "Medium Traffic", "value", medCount, "color", "#F59E0B"));
        distribution.add(Map.of("name", "High Traffic", "value", highCount, "color", "#EF4444"));
        stats.setTrafficDistribution(distribution);

        // Speed and vehicle trends from recent records
        List<Map<String, Object>> trends = recent.stream()
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("location", r.getLocation());
                    map.put("speed", r.getAverageSpeed());
                    map.put("vehicles", r.getVehicleCount());
                    map.put("riskScore", r.getRiskScore());
                    return map;
                })
                .collect(Collectors.toList());
        Collections.reverse(trends);
        stats.setSpeedTrends(trends);

        return stats;
    }

    private TrafficPredictResponseDto mapToDto(TrafficRecord record) {
        TrafficPredictResponseDto dto = new TrafficPredictResponseDto();
        dto.setId(record.getId());
        dto.setLocation(record.getLocation());
        dto.setVehicleCount(record.getVehicleCount());
        dto.setAverageSpeed(record.getAverageSpeed());
        dto.setWeatherCondition(record.getWeatherCondition());
        dto.setTimeOfDay(record.getTimeOfDay());
        dto.setRoadType(record.getRoadType());
        dto.setPredictedTrafficLevel(record.getPredictedTrafficLevel());
        dto.setConfidence(record.getConfidence());
        dto.setRiskScore(record.getRiskScore());
        dto.setRecommendation(record.getRecommendation());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setCreatedBy(record.getUser() != null ? record.getUser().getUsername() : "System / Automated");
        return dto;
    }
}
