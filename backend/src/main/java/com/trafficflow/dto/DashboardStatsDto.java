package com.trafficflow.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    private Long totalRecords;
    private Long lowTrafficCount;
    private Long mediumTrafficCount;
    private Long highTrafficCount;
    private Double averageSpeed;
    private Long totalVehicles;
    private List<TrafficPredictResponseDto> recentPredictions;
    private List<Map<String, Object>> trafficDistribution;
    private List<Map<String, Object>> speedTrends;
    private Long totalUsers;

    public DashboardStatsDto() {}

    public Long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(Long totalRecords) { this.totalRecords = totalRecords; }

    public Long getLowTrafficCount() { return lowTrafficCount; }
    public void setLowTrafficCount(Long lowTrafficCount) { this.lowTrafficCount = lowTrafficCount; }

    public Long getMediumTrafficCount() { return mediumTrafficCount; }
    public void setMediumTrafficCount(Long mediumTrafficCount) { this.mediumTrafficCount = mediumTrafficCount; }

    public Long getHighTrafficCount() { return highTrafficCount; }
    public void setHighTrafficCount(Long highTrafficCount) { this.highTrafficCount = highTrafficCount; }

    public Double getAverageSpeed() { return averageSpeed; }
    public void setAverageSpeed(Double averageSpeed) { this.averageSpeed = averageSpeed; }

    public Long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(Long totalVehicles) { this.totalVehicles = totalVehicles; }

    public List<TrafficPredictResponseDto> getRecentPredictions() { return recentPredictions; }
    public void setRecentPredictions(List<TrafficPredictResponseDto> recentPredictions) { this.recentPredictions = recentPredictions; }

    public List<Map<String, Object>> getTrafficDistribution() { return trafficDistribution; }
    public void setTrafficDistribution(List<Map<String, Object>> trafficDistribution) { this.trafficDistribution = trafficDistribution; }

    public List<Map<String, Object>> getSpeedTrends() { return speedTrends; }
    public void setSpeedTrends(List<Map<String, Object>> speedTrends) { this.speedTrends = speedTrends; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
}
