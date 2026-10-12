package com.trafficflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "road_id")
    private Road road;

    @Column(name = "alert_type", nullable = false, length = 30)
    private String alertType; // HIGH_RISK, MODERATE_RISK, INCIDENT, WEATHER_WARNING

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false, length = 20)
    private String severity; // LOW, MODERATE, HIGH, SEVERE

    @Column(name = "is_dismissed", nullable = false)
    private Boolean isDismissed = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Alert() {}

    public Alert(Road road, String alertType, String title, String message, String severity) {
        this.road = road;
        this.alertType = alertType;
        this.title = title;
        this.message = message;
        this.severity = severity;
        this.isDismissed = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Road getRoad() { return road; }
    public void setRoad(Road road) { this.road = road; }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Boolean getIsDismissed() { return isDismissed; }
    public void setIsDismissed(Boolean isDismissed) { this.isDismissed = isDismissed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
