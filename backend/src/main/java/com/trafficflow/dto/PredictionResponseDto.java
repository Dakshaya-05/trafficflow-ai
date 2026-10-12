package com.trafficflow.dto;

import java.util.List;
import java.util.Map;

public class PredictionResponseDto {

    private Long roadId;
    private String roadName;
    private String predictedCongestion; // LOW, MODERATE, HIGH, SEVERE
    private Double riskScore; // 0 - 100
    private Double confidence; // 0.0 - 1.0
    private Integer predictionWindowMinutes;
    private List<String> factors;
    private String explanation;
    private Map<String, Double> featureContributions;
    private Map<String, Double> classProbabilities;
    private Double predictedSpeed;
    private Integer predictedVolume;

    public PredictionResponseDto() {}

    public Long getRoadId() { return roadId; }
    public void setRoadId(Long roadId) { this.roadId = roadId; }

    public String getRoadName() { return roadName; }
    public void setRoadName(String roadName) { this.roadName = roadName; }

    public String getPredictedCongestion() { return predictedCongestion; }
    public void setPredictedCongestion(String predictedCongestion) { this.predictedCongestion = predictedCongestion; }

    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Integer getPredictionWindowMinutes() { return predictionWindowMinutes; }
    public void setPredictionWindowMinutes(Integer predictionWindowMinutes) { this.predictionWindowMinutes = predictionWindowMinutes; }

    public List<String> getFactors() { return factors; }
    public void setFactors(List<String> factors) { this.factors = factors; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Map<String, Double> getFeatureContributions() { return featureContributions; }
    public void setFeatureContributions(Map<String, Double> featureContributions) { this.featureContributions = featureContributions; }

    public Map<String, Double> getClassProbabilities() { return classProbabilities; }
    public void setClassProbabilities(Map<String, Double> classProbabilities) { this.classProbabilities = classProbabilities; }

    public Double getPredictedSpeed() { return predictedSpeed; }
    public void setPredictedSpeed(Double predictedSpeed) { this.predictedSpeed = predictedSpeed; }

    public Integer getPredictedVolume() { return predictedVolume; }
    public void setPredictedVolume(Integer predictedVolume) { this.predictedVolume = predictedVolume; }
}
