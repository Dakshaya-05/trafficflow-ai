package com.trafficflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String type; // ACCIDENT, ROAD_WORK, WEATHER, EVENT, ROAD_CLOSURE

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "road_id")
    private Road road;

    @Column(name = "location_name", nullable = false, length = 150)
    private String locationName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 20)
    private String severity; // LOW, MODERATE, HIGH, SEVERE

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, RESOLVING, RESOLVED

    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();

    @Column(name = "estimated_clearance_at")
    private LocalDateTime estimatedClearanceAt;

    public Incident() {}

    public Incident(String type, Road road, String locationName, Double latitude, Double longitude,
                    String description, String severity, String status, LocalDateTime estimatedClearanceAt) {
        this.type = type;
        this.road = road;
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.severity = severity;
        this.status = status != null ? status : "ACTIVE";
        this.reportedAt = LocalDateTime.now();
        this.estimatedClearanceAt = estimatedClearanceAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Road getRoad() { return road; }
    public void setRoad(Road road) { this.road = road; }

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
