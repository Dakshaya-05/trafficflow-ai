package com.trafficflow.client;

import com.trafficflow.dto.TrafficPredictRequestDto;
import com.trafficflow.dto.TrafficPredictResponseDto;

public interface AiPredictorClient {
    TrafficPredictResponseDto predict(TrafficPredictRequestDto requestDto);
}
