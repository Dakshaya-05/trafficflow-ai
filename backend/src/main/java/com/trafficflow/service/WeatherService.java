package com.trafficflow.service;

import com.trafficflow.model.WeatherData;
import com.trafficflow.repository.WeatherDataRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WeatherService {

    private final WeatherDataRepository weatherDataRepository;

    public WeatherService(WeatherDataRepository weatherDataRepository) {
        this.weatherDataRepository = weatherDataRepository;
    }

    public WeatherData getCurrentWeather() {
        return weatherDataRepository.findLatest()
                .orElseGet(() -> new WeatherData("Hyderabad", 27.0, 12.0, 84.0, "Moderate Rain", "WET", 7.0));
    }

    public WeatherData updateWeather(WeatherData weatherData) {
        return weatherDataRepository.save(weatherData);
    }
}
