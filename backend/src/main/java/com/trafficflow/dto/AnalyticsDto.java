package com.trafficflow.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsDto {

    private List<TimePointData> volumeTrends;
    private List<RoadComparisonData> currentVsPredicted;
    private List<CongestionDistribution> congestionDistribution;
    private WeatherImpactSummary weatherImpact;
    private ModelAccuracyMetrics accuracyMetrics;

    public AnalyticsDto() {}

    public static class TimePointData {
        private String timeLabel;
        private Integer actualVolume;
        private Integer predictedVolume;
        private Double actualSpeed;
        private Double predictedSpeed;

        public TimePointData(String timeLabel, Integer actualVolume, Integer predictedVolume, Double actualSpeed, Double predictedSpeed) {
            this.timeLabel = timeLabel;
            this.actualVolume = actualVolume;
            this.predictedVolume = predictedVolume;
            this.actualSpeed = actualSpeed;
            this.predictedSpeed = predictedSpeed;
        }

        public String getTimeLabel() { return timeLabel; }
        public Integer getActualVolume() { return actualVolume; }
        public Integer getPredictedVolume() { return predictedVolume; }
        public Double getActualSpeed() { return actualSpeed; }
        public Double getPredictedSpeed() { return predictedSpeed; }
    }

    public static class RoadComparisonData {
        private String roadName;
        private String currentCongestion;
        private String predictedCongestion;
        private Double currentSpeed;
        private Double predictedSpeed;
        private Integer currentVolume;
        private Integer predictedVolume;
        private Double riskScore;

        public RoadComparisonData(String roadName, String currentCongestion, String predictedCongestion,
                                  Double currentSpeed, Double predictedSpeed, Integer currentVolume,
                                  Integer predictedVolume, Double riskScore) {
            this.roadName = roadName;
            this.currentCongestion = currentCongestion;
            this.predictedCongestion = predictedCongestion;
            this.currentSpeed = currentSpeed;
            this.predictedSpeed = predictedSpeed;
            this.currentVolume = currentVolume;
            this.predictedVolume = predictedVolume;
            this.riskScore = riskScore;
        }

        public String getRoadName() { return roadName; }
        public String getCurrentCongestion() { return currentCongestion; }
        public String getPredictedCongestion() { return predictedCongestion; }
        public Double getCurrentSpeed() { return currentSpeed; }
        public Double getPredictedSpeed() { return predictedSpeed; }
        public Integer getCurrentVolume() { return currentVolume; }
        public Integer getPredictedVolume() { return predictedVolume; }
        public Double getRiskScore() { return riskScore; }
    }

    public static class CongestionDistribution {
        private String level;
        private Integer count;
        private String color;

        public CongestionDistribution(String level, Integer count, String color) {
            this.level = level;
            this.count = count;
            this.color = color;
        }

        public String getLevel() { return level; }
        public Integer getCount() { return count; }
        public String getColor() { return color; }
    }

    public static class WeatherImpactSummary {
        private Double speedReductionPercent;
        private Double volumeReductionPercent;
        private String currentCondition;
        private Double rainfallMm;
        private String roadSurfaceStatus;

        public WeatherImpactSummary(Double speedReductionPercent, Double volumeReductionPercent,
                                    String currentCondition, Double rainfallMm, String roadSurfaceStatus) {
            this.speedReductionPercent = speedReductionPercent;
            this.volumeReductionPercent = volumeReductionPercent;
            this.currentCondition = currentCondition;
            this.rainfallMm = rainfallMm;
            this.roadSurfaceStatus = roadSurfaceStatus;
        }

        public Double getSpeedReductionPercent() { return speedReductionPercent; }
        public Double getVolumeReductionPercent() { return volumeReductionPercent; }
        public String getCurrentCondition() { return currentCondition; }
        public Double getRainfallMm() { return rainfallMm; }
        public String getRoadSurfaceStatus() { return roadSurfaceStatus; }
    }

    public static class ModelAccuracyMetrics {
        private Double accuracy;
        private Double precision;
        private Double recall;
        private Double f1Score;
        private Boolean isDemonstrationMetric;
        private String label;
        private Map<String, Double> featureWeights;

        public ModelAccuracyMetrics(Double accuracy, Double precision, Double recall, Double f1Score,
                                    Boolean isDemonstrationMetric, String label, Map<String, Double> featureWeights) {
            this.accuracy = accuracy;
            this.precision = precision;
            this.recall = recall;
            this.f1Score = f1Score;
            this.isDemonstrationMetric = isDemonstrationMetric;
            this.label = label;
            this.featureWeights = featureWeights;
        }

        public Double getAccuracy() { return accuracy; }
        public Double getPrecision() { return precision; }
        public Double getRecall() { return recall; }
        public Double getF1Score() { return f1Score; }
        public Boolean getIsDemonstrationMetric() { return isDemonstrationMetric; }
        public String getLabel() { return label; }
        public Map<String, Double> getFeatureWeights() { return featureWeights; }
    }

    public List<TimePointData> getVolumeTrends() { return volumeTrends; }
    public void setVolumeTrends(List<TimePointData> volumeTrends) { this.volumeTrends = volumeTrends; }

    public List<RoadComparisonData> getCurrentVsPredicted() { return currentVsPredicted; }
    public void setCurrentVsPredicted(List<RoadComparisonData> currentVsPredicted) { this.currentVsPredicted = currentVsPredicted; }

    public List<CongestionDistribution> getCongestionDistribution() { return congestionDistribution; }
    public void setCongestionDistribution(List<CongestionDistribution> congestionDistribution) { this.congestionDistribution = congestionDistribution; }

    public WeatherImpactSummary getWeatherImpact() { return weatherImpact; }
    public void setWeatherImpact(WeatherImpactSummary weatherImpact) { this.weatherImpact = weatherImpact; }

    public ModelAccuracyMetrics getAccuracyMetrics() { return accuracyMetrics; }
    public void setAccuracyMetrics(ModelAccuracyMetrics accuracyMetrics) { this.accuracyMetrics = accuracyMetrics; }
}
