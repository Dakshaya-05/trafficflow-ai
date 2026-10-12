package com.trafficflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_records")
public class TrafficRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "vehicle_count", nullable = false)
    private Integer vehicleCount;

    @Column(name = "average_speed", nullable = false)
    private Double averageSpeed;

    @Column(name = "weather_condition", nullable = false, length = 50)
    private String weatherCondition; // Clear, Rainy, Foggy, Snowy, Overcast

    @Column(name = "time_of_day", nullable = false, length = 50)
    private String timeOfDay; // Morning Rush, Afternoon, Evening Rush, Night

    @Column(name = "road_type", nullable = false, length = 50)
    private String roadType; // Highway, Arterial, Urban, Residential

    @Column(name = "predicted_traffic_level", nullable = false, length = 30)
    private String predictedTrafficLevel; // LOW TRAFFIC, MEDIUM TRAFFIC, HIGH TRAFFIC

    @Column(nullable = false)
    private Double confidence;

    @Column(name = "risk_score", nullable = false)
    private Double riskScore;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public TrafficRecord() {}

    public TrafficRecord(String location, Integer vehicleCount, Double averageSpeed,
                         String weatherCondition, String timeOfDay, String roadType,
                         String predictedTrafficLevel, Double confidence, Double riskScore,
                         String recommendation, User user) {
        this.location = location;
        this.vehicleCount = vehicleCount;
        this.averageSpeed = averageSpeed;
        this.weatherCondition = weatherCondition;
        this.timeOfDay = timeOfDay;
        this.roadType = roadType;
        this.predictedTrafficLevel = predictedTrafficLevel;
        this.confidence = confidence;
        this.riskScore = riskScore;
        this.recommendation = recommendation;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getVehicleCount() { return vehicleCount; }
    public void setVehicleCount(Integer vehicleCount) { this.vehicleCount = vehicleCount; }

    public Double getAverageSpeed() { return averageSpeed; }
    public void setAverageSpeed(Double averageSpeed) { this.averageSpeed = averageSpeed; }

    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }

    public String getTimeOfDay() { return timeOfDay; }
    public void setTimeOfDay(String timeOfDay) { this.timeOfDay = timeOfDay; }

    public String getRoadType() { return roadType; }
    public void setRoadType(String roadType) { this.roadType = roadType; }

    public String getPredictedTrafficLevel() { return predictedTrafficLevel; }
    public void setPredictedTrafficLevel(String predictedTrafficLevel) { this.predictedTrafficLevel = predictedTrafficLevel; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
