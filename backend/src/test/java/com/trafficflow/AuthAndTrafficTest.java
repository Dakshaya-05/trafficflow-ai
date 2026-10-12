package com.trafficflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trafficflow.client.AiPredictorClient;
import com.trafficflow.dto.AuthRequest;
import com.trafficflow.dto.RegisterRequest;
import com.trafficflow.dto.TrafficPredictRequestDto;
import com.trafficflow.dto.TrafficPredictResponseDto;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthAndTrafficTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AiPredictorClient aiPredictionClient;

    @Test
    void testUserRegistrationAndLoginFlow() throws Exception {
        String testUser = "testuser_" + System.currentTimeMillis();
        RegisterRequest registerReq = new RegisterRequest(
                testUser,
                testUser + "@example.com",
                "secretPassword123",
                "Test Engineer",
                "ROLE_USER"
        );

        // 1. Register
        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.username").value(testUser))
                .andReturn();

        // 2. Login
        AuthRequest loginReq = new AuthRequest(testUser, "secretPassword123");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }

    @Test
    void testDashboardStats() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRecords").isNumber())
                .andExpect(jsonPath("$.trafficDistribution").isArray());
    }

    @Test
    void testTrafficPredictionWithMockAi() throws Exception {
        TrafficPredictResponseDto mockAiResponse = new TrafficPredictResponseDto();
        mockAiResponse.setLocation("Cyber Towers Corridor");
        mockAiResponse.setPredictedTrafficLevel("HIGH TRAFFIC");
        mockAiResponse.setConfidence(0.92);
        mockAiResponse.setRiskScore(84.0);
        mockAiResponse.setRecommendation("High congestion predicted. Divert traffic via alternate routes.");
        mockAiResponse.setFactors(List.of("Volume above capacity", "Rush hour concentration"));

        Mockito.when(aiPredictionClient.predict(any(TrafficPredictRequestDto.class)))
                .thenReturn(mockAiResponse);

        // Login with seeded admin to get token
        AuthRequest loginReq = new AuthRequest("admin", "admin123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        Map respMap = objectMapper.readValue(loginResult.getResponse().getContentAsString(), Map.class);
        String jwtToken = (String) respMap.get("token");

        TrafficPredictRequestDto predictReq = new TrafficPredictRequestDto(
                "Cyber Towers Corridor",
                1450,
                22.0,
                "Rainy",
                "Evening Rush",
                "Highway"
        );

        mockMvc.perform(post("/api/traffic/predict")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(predictReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.predictedTrafficLevel").value("HIGH TRAFFIC"))
                .andExpect(jsonPath("$.confidence").value(0.92))
                .andExpect(jsonPath("$.riskScore").value(84.0));
    }
}
