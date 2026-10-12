package com.trafficflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "road_id", nullable = false)
    private Road road;

    @Column(name = "prediction_window_minutes", nullable = false)
    private Integer predictionWindowMinutes; // 15, 30, 45, 60

    @Column(name = "predicted_congestion", nullable = false, length = 20)
    private String predictedCongestion; // LOW, MODERATE, HIGH, SEVERE

    @Column(name = "risk_score", nullable = false)
    private Double riskScore; // 0 - 100

    @Column(nullable = false)
    private Double confidence; // 0.0 - 1.0

    @Column(name = "predicted_speed", nullable = false)
    private Double predictedSpeed;

    @Column(name = "predicted_volume", nullable = false)
    private Integer predictedVolume;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String factors; // JSON or comma-separated list of factors

    @Column(columnDefinition = "TEXT", nullable = false)
    private String explanation; // Explainable AI rationale

    @Column(name = "predicted_at")
    private LocalDateTime predictedAt = LocalDateTime.now();

    public Prediction() {}

    public Prediction(Road road, Integer predictionWindowMinutes, String predictedCongestion,
                      Double riskScore, Double confidence, Double predictedSpeed,
                      Integer predictedVolume, String factors, String explanation) {
        this.road = road;
        this.predictionWindowMinutes = predictionWindowMinutes;
        this.predictedCongestion = predictedCongestion;
        this.riskScore = riskScore;
        this.confidence = confidence;
        this.predictedSpeed = predictedSpeed;
        this.predictedVolume = predictedVolume;
        this.factors = factors;
        this.explanation = explanation;
        this.predictedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Road getRoad() { return road; }
    public void setRoad(Road road) { this.road = road; }

    public Integer getPredictionWindowMinutes() { return predictionWindowMinutes; }
    public void setPredictionWindowMinutes(Integer predictionWindowMinutes) { this.predictionWindowMinutes = predictionWindowMinutes; }

    public String getPredictedCongestion() { return predictedCongestion; }
    public void setPredictedCongestion(String predictedCongestion) { this.predictedCongestion = predictedCongestion; }

    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Double getPredictedSpeed() { return predictedSpeed; }
    public void setPredictedSpeed(Double predictedSpeed) { this.predictedSpeed = predictedSpeed; }

    public Integer getPredictedVolume() { return predictedVolume; }
    public void setPredictedVolume(Integer predictedVolume) { this.predictedVolume = predictedVolume; }

    public String getFactors() { return factors; }
    public void setFactors(String factors) { this.factors = factors; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public LocalDateTime getPredictedAt() { return predictedAt; }
    public void setPredictedAt(LocalDateTime predictedAt) { this.predictedAt = predictedAt; }
}
