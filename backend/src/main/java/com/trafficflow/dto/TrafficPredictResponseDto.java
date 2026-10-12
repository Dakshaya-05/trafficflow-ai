package com.trafficflow.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class TrafficPredictResponseDto {

    private Long id;
    private String location;
    private Integer vehicleCount;
    private Double averageSpeed;
    private String weatherCondition;
    private String timeOfDay;
    private String roadType;
    private String predictedTrafficLevel; // LOW TRAFFIC, MEDIUM TRAFFIC, HIGH TRAFFIC
    private Double confidence;
    private Double riskScore;
    private String recommendation;
    private List<String> factors;
    private Map<String, Object> details;
    private LocalDateTime createdAt;
    private String createdBy;

    public TrafficPredictResponseDto() {}

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

    public List<String> getFactors() { return factors; }
    public void setFactors(List<String> factors) { this.factors = factors; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
