package com.trafficflow.controller;

import com.trafficflow.model.WeatherData;
import com.trafficflow.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<WeatherData> getWeather() {
        return ResponseEntity.ok(weatherService.getCurrentWeather());
    }

    @PostMapping
    public ResponseEntity<WeatherData> updateWeather(@RequestBody WeatherData weatherData) {
        return ResponseEntity.ok(weatherService.updateWeather(weatherData));
    }
}
