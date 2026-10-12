package com.trafficflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String city = "Hyderabad";

    @Column(nullable = false)
    private Double temperature;

    @Column(name = "rainfall_mm", nullable = false)
    private Double rainfallMm;

    @Column(nullable = false)
    private Double humidity;

    @Column(name = "weather_condition", nullable = false, length = 50)
    private String condition; // Heavy Rain, Moderate Rain, Clear, etc.

    @Column(name = "road_condition", nullable = false, length = 30)
    private String roadCondition; // DRY, WET, FLOODED, SLIPPERY

    @Column(name = "visibility_km", nullable = false)
    private Double visibilityKm;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public WeatherData() {}

    public WeatherData(String city, Double temperature, Double rainfallMm, Double humidity,
                       String condition, String roadCondition, Double visibilityKm) {
        this.city = city;
        this.temperature = temperature;
        this.rainfallMm = rainfallMm;
        this.humidity = humidity;
        this.condition = condition;
        this.roadCondition = roadCondition;
        this.visibilityKm = visibilityKm;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getRainfallMm() { return rainfallMm; }
    public void setRainfallMm(Double rainfallMm) { this.rainfallMm = rainfallMm; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getRoadCondition() { return roadCondition; }
    public void setRoadCondition(String roadCondition) { this.roadCondition = roadCondition; }

    public Double getVisibilityKm() { return visibilityKm; }
    public void setVisibilityKm(Double visibilityKm) { this.visibilityKm = visibilityKm; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
