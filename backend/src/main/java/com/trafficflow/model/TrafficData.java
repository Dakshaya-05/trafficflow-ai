package com.trafficflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_data")
public class TrafficData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "road_id", nullable = false)
    private Road road;

    @Column(name = "traffic_volume", nullable = false)
    private Integer trafficVolume;

    @Column(name = "average_speed", nullable = false)
    private Double averageSpeed;

    @Column(name = "congestion_level", nullable = false, length = 20)
    private String congestionLevel; // LOW, MODERATE, HIGH, SEVERE

    @Column(name = "historical_average_volume", nullable = false)
    private Integer historicalAverageVolume;

    @Column(name = "occupancy_rate", nullable = false)
    private Double occupancyRate;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();

    public TrafficData() {}

    public TrafficData(Road road, Integer trafficVolume, Double averageSpeed, String congestionLevel,
                       Integer historicalAverageVolume, Double occupancyRate) {
        this.road = road;
        this.trafficVolume = trafficVolume;
        this.averageSpeed = averageSpeed;
        this.congestionLevel = congestionLevel;
        this.historicalAverageVolume = historicalAverageVolume;
        this.occupancyRate = occupancyRate;
        this.recordedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Road getRoad() { return road; }
    public void setRoad(Road road) { this.road = road; }

    public Integer getTrafficVolume() { return trafficVolume; }
    public void setTrafficVolume(Integer trafficVolume) { this.trafficVolume = trafficVolume; }

    public Double getAverageSpeed() { return averageSpeed; }
    public void setAverageSpeed(Double averageSpeed) { this.averageSpeed = averageSpeed; }

    public String getCongestionLevel() { return congestionLevel; }
    public void setCongestionLevel(String congestionLevel) { this.congestionLevel = congestionLevel; }

    public Integer getHistoricalAverageVolume() { return historicalAverageVolume; }
    public void setHistoricalAverageVolume(Integer historicalAverageVolume) { this.historicalAverageVolume = historicalAverageVolume; }

    public Double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Double occupancyRate) { this.occupancyRate = occupancyRate; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
