package com.trafficflow.dto;

import java.util.List;

public class RoadTrafficDto {

    private Long id;
    private String name;
    private String code;
    private String startLocation;
    private String endLocation;
    private Double lengthKm;
    private Integer speedLimitKmh;
    private String coordinates;
    private Double centerLat;
    private Double centerLng;
    private String zone;

    // Current Traffic Snapshot
    private Integer currentVolume;
    private Double currentSpeed;
    private String currentCongestion;
    private Integer historicalVolume;
    private Double occupancyRate;

    // Latest Prediction Snapshot (e.g. 30 min)
    private String predictedCongestion;
    private Double riskScore;
    private Double confidence;
    private Integer predictionWindowMinutes;
    private Double predictedSpeed;
    private Integer predictedVolume;
    private List<String> factors;
    private String explanation;

    // Associated Active Incident count/description
    private Integer activeIncidentsCount;
    private String latestIncidentDescription;

    public RoadTrafficDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getStartLocation() { return startLocation; }
    public void setStartLocation(String startLocation) { this.startLocation = startLocation; }

    public String getEndLocation() { return endLocation; }
    public void setEndLocation(String endLocation) { this.endLocation = endLocation; }

    public Double getLengthKm() { return lengthKm; }
    public void setLengthKm(Double lengthKm) { this.lengthKm = lengthKm; }

    public Integer getSpeedLimitKmh() { return speedLimitKmh; }
    public void setSpeedLimitKmh(Integer speedLimitKmh) { this.speedLimitKmh = speedLimitKmh; }

    public String getCoordinates() { return coordinates; }
    public void setCoordinates(String coordinates) { this.coordinates = coordinates; }

    public Double getCenterLat() { return centerLat; }
    public void setCenterLat(Double centerLat) { this.centerLat = centerLat; }

    public Double getCenterLng() { return centerLng; }
    public void setCenterLng(Double centerLng) { this.centerLng = centerLng; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public Integer getCurrentVolume() { return currentVolume; }
    public void setCurrentVolume(Integer currentVolume) { this.currentVolume = currentVolume; }

    public Double getCurrentSpeed() { return currentSpeed; }
    public void setCurrentSpeed(Double currentSpeed) { this.currentSpeed = currentSpeed; }

    public String getCurrentCongestion() { return currentCongestion; }
    public void setCurrentCongestion(String currentCongestion) { this.currentCongestion = currentCongestion; }

    public Integer getHistoricalVolume() { return historicalVolume; }
    public void setHistoricalVolume(Integer historicalVolume) { this.historicalVolume = historicalVolume; }

    public Double getOccupancyRate() { return occupancyRate; }
    public void setOccupancyRate(Double occupancyRate) { this.occupancyRate = occupancyRate; }

    public String getPredictedCongestion() { return predictedCongestion; }
    public void setPredictedCongestion(String predictedCongestion) { this.predictedCongestion = predictedCongestion; }

    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Integer getPredictionWindowMinutes() { return predictionWindowMinutes; }
    public void setPredictionWindowMinutes(Integer predictionWindowMinutes) { this.predictionWindowMinutes = predictionWindowMinutes; }

    public Double getPredictedSpeed() { return predictedSpeed; }
    public void setPredictedSpeed(Double predictedSpeed) { this.predictedSpeed = predictedSpeed; }

    public Integer getPredictedVolume() { return predictedVolume; }
    public void setPredictedVolume(Integer predictedVolume) { this.predictedVolume = predictedVolume; }

    public List<String> getFactors() { return factors; }
    public void setFactors(List<String> factors) { this.factors = factors; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Integer getActiveIncidentsCount() { return activeIncidentsCount; }
    public void setActiveIncidentsCount(Integer activeIncidentsCount) { this.activeIncidentsCount = activeIncidentsCount; }

    public String getLatestIncidentDescription() { return latestIncidentDescription; }
    public void setLatestIncidentDescription(String latestIncidentDescription) { this.latestIncidentDescription = latestIncidentDescription; }
}
