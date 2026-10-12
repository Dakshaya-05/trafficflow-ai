package com.trafficflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TrafficPredictRequestDto {

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Vehicle count is required")
    @Min(value = 0, message = "Vehicle count cannot be negative")
    private Integer vehicleCount;

    @NotNull(message = "Average speed is required")
    @Min(value = 0, message = "Average speed cannot be negative")
    private Double averageSpeed;

    @NotBlank(message = "Weather condition is required")
    private String weatherCondition; // Clear, Rainy, Foggy, Snowy, Overcast

    @NotBlank(message = "Time of day is required")
    private String timeOfDay; // Morning Rush, Afternoon, Evening Rush, Night

    @NotBlank(message = "Road type is required")
    private String roadType; // Highway, Arterial, Urban, Residential

    public TrafficPredictRequestDto() {}

    public TrafficPredictRequestDto(String location, Integer vehicleCount, Double averageSpeed,
                                    String weatherCondition, String timeOfDay, String roadType) {
        this.location = location;
        this.vehicleCount = vehicleCount;
        this.averageSpeed = averageSpeed;
        this.weatherCondition = weatherCondition;
        this.timeOfDay = timeOfDay;
        this.roadType = roadType;
    }

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
}
