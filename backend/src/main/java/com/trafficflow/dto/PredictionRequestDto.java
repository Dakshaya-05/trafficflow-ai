package com.trafficflow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PredictionRequestDto {

    private Long roadId;

    @NotNull
    private Double trafficVolume;

    @NotNull
    private Double averageSpeed;

    @NotNull
    private Double historicalAverageVolume;

    @NotNull
    @Min(0)
    @Max(23)
    private Integer hour;

    @NotNull
    @Min(0)
    @Max(6)
    private Integer dayOfWeek;

    @NotNull
    @Min(0)
    private Double rainfall;

    @NotNull
    private Double temperature;

    @NotNull
    private String roadCondition; // DRY, WET, FLOODED, SLIPPERY

    @NotNull
    private Boolean accidentNearby;

    @NotNull
    private Boolean publicEventNearby;

    @NotNull
    private String currentCongestion; // LOW, MODERATE, HIGH, SEVERE

    @NotNull
    private String nearbyCongestion; // LOW, MODERATE, HIGH, SEVERE

    private Integer predictionWindowMinutes = 30;

    public PredictionRequestDto() {}

    public Long getRoadId() { return roadId; }
    public void setRoadId(Long roadId) { this.roadId = roadId; }

    public Double getTrafficVolume() { return trafficVolume; }
    public void setTrafficVolume(Double trafficVolume) { this.trafficVolume = trafficVolume; }

    public Double getAverageSpeed() { return averageSpeed; }
    public void setAverageSpeed(Double averageSpeed) { this.averageSpeed = averageSpeed; }

    public Double getHistoricalAverageVolume() { return historicalAverageVolume; }
    public void setHistoricalAverageVolume(Double historicalAverageVolume) { this.historicalAverageVolume = historicalAverageVolume; }

    public Integer getHour() { return hour; }
    public void setHour(Integer hour) { this.hour = hour; }

    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public Double getRainfall() { return rainfall; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getRoadCondition() { return roadCondition; }
    public void setRoadCondition(String roadCondition) { this.roadCondition = roadCondition; }

    public Boolean getAccidentNearby() { return accidentNearby; }
    public void setAccidentNearby(Boolean accidentNearby) { this.accidentNearby = accidentNearby; }

    public Boolean getPublicEventNearby() { return publicEventNearby; }
    public void setPublicEventNearby(Boolean publicEventNearby) { this.publicEventNearby = publicEventNearby; }

    public String getCurrentCongestion() { return currentCongestion; }
    public void setCurrentCongestion(String currentCongestion) { this.currentCongestion = currentCongestion; }

    public String getNearbyCongestion() { return nearbyCongestion; }
    public void setNearbyCongestion(String nearbyCongestion) { this.nearbyCongestion = nearbyCongestion; }

    public Integer getPredictionWindowMinutes() { return predictionWindowMinutes; }
    public void setPredictionWindowMinutes(Integer predictionWindowMinutes) { this.predictionWindowMinutes = predictionWindowMinutes; }
}
