package com.trafficflow.service;

import com.trafficflow.client.MlServiceClient;
import com.trafficflow.dto.AnalyticsDto;
import com.trafficflow.dto.RoadTrafficDto;
import com.trafficflow.model.WeatherData;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    private final TrafficService trafficService;
    private final WeatherService weatherService;
    private final MlServiceClient mlServiceClient;

    public AnalyticsService(TrafficService trafficService,
                            WeatherService weatherService,
                            MlServiceClient mlServiceClient) {
        this.trafficService = trafficService;
        this.weatherService = weatherService;
        this.mlServiceClient = mlServiceClient;
    }

    public AnalyticsDto getAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();
        List<RoadTrafficDto> roads = trafficService.getAllRoadsWithTraffic();
        WeatherData weather = weatherService.getCurrentWeather();

        // 1. Hourly trends (Simulated realistic 12-hour timeline from morning to evening rush)
        List<AnalyticsDto.TimePointData> trends = new ArrayList<>();
        trends.add(new AnalyticsDto.TimePointData("14:00", 920, 940, 48.0, 46.5));
        trends.add(new AnalyticsDto.TimePointData("15:00", 1050, 1080, 44.0, 43.0));
        trends.add(new AnalyticsDto.TimePointData("16:00", 1180, 1220, 39.5, 38.0));
        trends.add(new AnalyticsDto.TimePointData("17:00", 1390, 1450, 33.0, 31.5));
        trends.add(new AnalyticsDto.TimePointData("18:00 (Now)", 1540, 1680, 26.5, 22.0));
        trends.add(new AnalyticsDto.TimePointData("+15m", 1580, 1720, 24.0, 20.5));
        trends.add(new AnalyticsDto.TimePointData("+30m", 1620, 1790, 22.0, 18.0));
        trends.add(new AnalyticsDto.TimePointData("+45m", 1590, 1750, 23.5, 19.5));
        trends.add(new AnalyticsDto.TimePointData("+60m", 1460, 1580, 29.0, 25.0));
        dto.setVolumeTrends(trends);

        // 2. Current vs Predicted Comparison across Roads
        List<AnalyticsDto.RoadComparisonData> compList = new ArrayList<>();
        for (RoadTrafficDto r : roads) {
            compList.add(new AnalyticsDto.RoadComparisonData(
                    r.getName(),
                    r.getCurrentCongestion(),
                    r.getPredictedCongestion(),
                    r.getCurrentSpeed(),
                    r.getPredictedSpeed(),
                    r.getCurrentVolume(),
                    r.getPredictedVolume(),
                    r.getRiskScore()
            ));
        }
        dto.setCurrentVsPredicted(compList);

        // 3. Congestion Distribution
        int low = 0, mod = 0, high = 0, severe = 0;
        for (RoadTrafficDto r : roads) {
            String c = r.getPredictedCongestion() != null ? r.getPredictedCongestion().toUpperCase() : "MODERATE";
            switch (c) {
                case "LOW" -> low++;
                case "MODERATE" -> mod++;
                case "HIGH" -> high++;
                case "SEVERE" -> severe++;
                default -> mod++;
            }
        }
        dto.setCongestionDistribution(List.of(
                new AnalyticsDto.CongestionDistribution("LOW", low, "#22c55e"),
                new AnalyticsDto.CongestionDistribution("MODERATE", mod, "#eab308"),
                new AnalyticsDto.CongestionDistribution("HIGH", high, "#f97316"),
                new AnalyticsDto.CongestionDistribution("SEVERE", severe, "#ef4444")
        ));

        // 4. Weather Impact Summary
        double rain = weather.getRainfallMm();
        double speedDrop = rain > 10.0 ? 21.4 : (rain > 2.0 ? 12.0 : 4.0);
        dto.setWeatherImpact(new AnalyticsDto.WeatherImpactSummary(
                speedDrop,
                8.5,
                weather.getCondition(),
                rain,
                weather.getRoadCondition()
        ));

        // 5. ML Model Accuracy & Demonstration Metrics
        Map<String, Object> mlMetrics = mlServiceClient.getMetrics();
        Double acc = mlMetrics.get("accuracy") instanceof Number ? ((Number) mlMetrics.get("accuracy")).doubleValue() : 0.874;
        Double prec = mlMetrics.get("precision") instanceof Number ? ((Number) mlMetrics.get("precision")).doubleValue() : 0.852;
        Double rec = mlMetrics.get("recall") instanceof Number ? ((Number) mlMetrics.get("recall")).doubleValue() : 0.838;
        Double f1 = mlMetrics.get("f1_score") instanceof Number ? ((Number) mlMetrics.get("f1_score")).doubleValue() : 0.845;

        Map<String, Double> weights = new LinkedHashMap<>();
        weights.put("Traffic Volume Spike", 0.28);
        weights.put("Nearby Incident", 0.25);
        weights.put("Precipitation & Road Friction", 0.22);
        weights.put("Public Event Proximity", 0.20);
        weights.put("Peak Commute Hour", 0.18);
        weights.put("Downstream Gridlock Cascade", 0.15);

        dto.setAccuracyMetrics(new AnalyticsDto.ModelAccuracyMetrics(
                Math.round(acc * 1000.0) / 10.0,
                Math.round(prec * 1000.0) / 10.0,
                Math.round(rec * 1000.0) / 10.0,
                Math.round(f1 * 1000.0) / 10.0,
                true,
                "DEMONSTRATION METRICS (Trained on synthetic urban flow dataset)",
                weights
        ));

        return dto;
    }
}
