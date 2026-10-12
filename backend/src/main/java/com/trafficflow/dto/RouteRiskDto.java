package com.trafficflow.dto;

import java.util.List;

public class RouteRiskDto {

    private String origin;
    private String destination;
    private Double distanceKm;
    private Integer currentTravelTimeMinutes;
    private Integer predictedTravelTimeMinutes;
    private String currentRiskLevel; // LOW, MODERATE, HIGH, SEVERE
    private String predictedRiskLevel; // LOW, MODERATE, HIGH, SEVERE
    private Double currentRiskScore;
    private Double predictedRiskScore;
    private List<String> primaryCorridors;
    private List<String> riskFactors;
    private String alternativeRouteName;
    private Integer alternativeTravelTimeMinutes;
    private String alternativeRiskLevel;
    private String recommendation;

    public RouteRiskDto() {}

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getCurrentTravelTimeMinutes() { return currentTravelTimeMinutes; }
    public void setCurrentTravelTimeMinutes(Integer currentTravelTimeMinutes) { this.currentTravelTimeMinutes = currentTravelTimeMinutes; }

    public Integer getPredictedTravelTimeMinutes() { return predictedTravelTimeMinutes; }
    public void setPredictedTravelTimeMinutes(Integer predictedTravelTimeMinutes) { this.predictedTravelTimeMinutes = predictedTravelTimeMinutes; }

    public String getCurrentRiskLevel() { return currentRiskLevel; }
    public void setCurrentRiskLevel(String currentRiskLevel) { this.currentRiskLevel = currentRiskLevel; }

    public String getPredictedRiskLevel() { return predictedRiskLevel; }
    public void setPredictedRiskLevel(String predictedRiskLevel) { this.predictedRiskLevel = predictedRiskLevel; }

    public Double getCurrentRiskScore() { return currentRiskScore; }
    public void setCurrentRiskScore(Double currentRiskScore) { this.currentRiskScore = currentRiskScore; }

    public Double getPredictedRiskScore() { return predictedRiskScore; }
    public void setPredictedRiskScore(Double predictedRiskScore) { this.predictedRiskScore = predictedRiskScore; }

    public List<String> getPrimaryCorridors() { return primaryCorridors; }
    public void setPrimaryCorridors(List<String> primaryCorridors) { this.primaryCorridors = primaryCorridors; }

    public List<String> getRiskFactors() { return riskFactors; }
    public void setRiskFactors(List<String> riskFactors) { this.riskFactors = riskFactors; }

    public String getAlternativeRouteName() { return alternativeRouteName; }
    public void setAlternativeRouteName(String alternativeRouteName) { this.alternativeRouteName = alternativeRouteName; }

    public Integer getAlternativeTravelTimeMinutes() { return alternativeTravelTimeMinutes; }
    public void setAlternativeTravelTimeMinutes(Integer alternativeTravelTimeMinutes) { this.alternativeTravelTimeMinutes = alternativeTravelTimeMinutes; }

    public String getAlternativeRiskLevel() { return alternativeRiskLevel; }
    public void setAlternativeRiskLevel(String alternativeRiskLevel) { this.alternativeRiskLevel = alternativeRiskLevel; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}
