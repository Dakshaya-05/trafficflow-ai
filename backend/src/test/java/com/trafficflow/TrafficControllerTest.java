package com.trafficflow;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class TrafficControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetRoads() throws Exception {
        mockMvc.perform(get("/api/traffic/roads"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").exists());
    }

    @Test
    void testGetCurrentWeather() throws Exception {
        mockMvc.perform(get("/api/weather"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.city").value("Hyderabad"));
    }

    @Test
    void testGetActiveAlerts() throws Exception {
        mockMvc.perform(get("/api/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetAnalytics() throws Exception {
        mockMvc.perform(get("/api/analytics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.volumeTrends").isArray())
                .andExpect(jsonPath("$.accuracyMetrics.isDemonstrationMetric").value(true));
    }

    @Test
    void testRouteRisk() throws Exception {
        mockMvc.perform(get("/api/routes/risk?from=Gachibowli&to=Hitech City"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.origin").value("Gachibowli"))
                .andExpect(jsonPath("$.predictedRiskLevel").exists());
    }

    @Test
    void testAssistantChat() throws Exception {
        String payload = "{\"message\": \"Which roads have the highest risk in the next 30 minutes?\"}";
        mockMvc.perform(post("/api/assistant/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").exists());
    }
}
