package com.trafficflow.service;

import com.trafficflow.dto.IncidentDto;
import com.trafficflow.model.Alert;
import com.trafficflow.model.Incident;
import com.trafficflow.model.Road;
import com.trafficflow.repository.AlertRepository;
import com.trafficflow.repository.IncidentRepository;
import com.trafficflow.repository.RoadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final RoadRepository roadRepository;
    private final AlertRepository alertRepository;

    public IncidentService(IncidentRepository incidentRepository,
                           RoadRepository roadRepository,
                           AlertRepository alertRepository) {
        this.incidentRepository = incidentRepository;
        this.roadRepository = roadRepository;
        this.alertRepository = alertRepository;
    }

    public List<IncidentDto> getAllIncidents() {
        return incidentRepository.findAllByOrderByReportedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<IncidentDto> getActiveIncidents() {
        return incidentRepository.findByStatusNotOrderByReportedAtDesc("RESOLVED").stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public IncidentDto createIncident(IncidentDto dto) {
        Road road = null;
        if (dto.getRoadId() != null) {
            road = roadRepository.findById(dto.getRoadId()).orElse(null);
        }

        Incident incident = new Incident(
                dto.getType(),
                road,
                dto.getLocationName(),
                dto.getLatitude(),
                dto.getLongitude(),
                dto.getDescription(),
                dto.getSeverity(),
                dto.getStatus() != null ? dto.getStatus() : "ACTIVE",
                dto.getEstimatedClearanceAt() != null ? dto.getEstimatedClearanceAt() : LocalDateTime.now().plusHours(1)
        );

        Incident saved = incidentRepository.save(incident);

        // Auto-generate high priority Alert if severity is HIGH or SEVERE
        if ("HIGH".equalsIgnoreCase(dto.getSeverity()) || "SEVERE".equalsIgnoreCase(dto.getSeverity())) {
            Alert alert = new Alert(
                    road,
                    "INCIDENT",
                    "New " + dto.getType() + " Incident: " + dto.getLocationName(),
                    dto.getDescription(),
                    dto.getSeverity()
            );
            alertRepository.save(alert);
        }

        return mapToDto(saved);
    }

    private IncidentDto mapToDto(Incident inc) {
        IncidentDto dto = new IncidentDto();
        dto.setId(inc.getId());
        dto.setType(inc.getType());
        if (inc.getRoad() != null) {
            dto.setRoadId(inc.getRoad().getId());
            dto.setRoadName(inc.getRoad().getName());
        }
        dto.setLocationName(inc.getLocationName());
        dto.setLatitude(inc.getLatitude());
        dto.setLongitude(inc.getLongitude());
        dto.setDescription(inc.getDescription());
        dto.setSeverity(inc.getSeverity());
        dto.setStatus(inc.getStatus());
        dto.setReportedAt(inc.getReportedAt());
        dto.setEstimatedClearanceAt(inc.getEstimatedClearanceAt());
        return dto;
    }
}
