package com.trafficflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class IncidentDto {

    private Long id;

    @NotBlank
    private String type; // ACCIDENT, ROAD_WORK, WEATHER, EVENT, ROAD_CLOSURE

    private Long roadId;
    private String roadName;

    @NotBlank
    private String locationName;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    @NotBlank
    private String description;

    @NotBlank
    private String severity; // LOW, MODERATE, HIGH, SEVERE

    private String status = "ACTIVE";
    private LocalDateTime reportedAt;
    private LocalDateTime estimatedClearanceAt;

    public IncidentDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getRoadId() { return roadId; }
    public void setRoadId(Long roadId) { this.roadId = roadId; }

    public String getRoadName() { return roadName; }
    public void setRoadName(String roadName) { this.roadName = roadName; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }

    public LocalDateTime getEstimatedClearanceAt() { return estimatedClearanceAt; }
    public void setEstimatedClearanceAt(LocalDateTime estimatedClearanceAt) { this.estimatedClearanceAt = estimatedClearanceAt; }
}
