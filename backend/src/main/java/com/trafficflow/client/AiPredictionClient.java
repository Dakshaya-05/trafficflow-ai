package com.trafficflow.client;

import com.trafficflow.dto.TrafficPredictRequestDto;
import com.trafficflow.dto.TrafficPredictResponseDto;
import com.trafficflow.exception.AiServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class AiPredictionClient implements AiPredictorClient {

    private static final Logger log = LoggerFactory.getLogger(AiPredictionClient.class);

    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public AiPredictionClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String getNormalizedUrl() {
        if (aiServiceUrl == null || aiServiceUrl.isBlank()) {
            return "http://localhost:8000";
        }
        String url = aiServiceUrl.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "http://" + url;
        }
        if (url.indexOf(":", 8) == -1 && !url.contains(".")) {
            url = url + ":10000";
        }
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    public TrafficPredictResponseDto predict(TrafficPredictRequestDto requestDto) {
        String endpoint = getNormalizedUrl() + "/api/traffic/predict";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<TrafficPredictRequestDto> entity = new HttpEntity<>(requestDto, headers);
            ResponseEntity<TrafficPredictResponseDto> response = restTemplate.postForEntity(
                    endpoint, entity, TrafficPredictResponseDto.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new AiServiceUnavailableException("AI service returned unexpected status: " + response.getStatusCode());
            }
        } catch (ResourceAccessException ex) {
            log.error("AI Prediction Service is unreachable at {}: {}", endpoint, ex.getMessage());
            throw new AiServiceUnavailableException(
                    "AI Traffic Prediction Service is currently unavailable. Please verify that the Python FastAPI service is running on " + aiServiceUrl + "."
            );
        } catch (RestClientException ex) {
            log.error("Error communicating with AI service at {}: {}", endpoint, ex.getMessage());
            throw new AiServiceUnavailableException(
                    "AI Traffic Prediction Service encountered an error: " + ex.getMessage()
            );
        }
    }
}
