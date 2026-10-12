package com.trafficflow.dto;

import java.time.LocalDateTime;

public class SimulationTickResponseDto {

    private boolean success;
    private String message;
    private int updatedRoadsCount;
    private int updatedPredictionsCount;
    private LocalDateTime timestamp = LocalDateTime.now();

    public SimulationTickResponseDto() {}

    public SimulationTickResponseDto(boolean success, String message, int updatedRoadsCount, int updatedPredictionsCount) {
        this.success = success;
        this.message = message;
        this.updatedRoadsCount = updatedRoadsCount;
        this.updatedPredictionsCount = updatedPredictionsCount;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getUpdatedRoadsCount() { return updatedRoadsCount; }
    public void setUpdatedRoadsCount(int updatedRoadsCount) { this.updatedRoadsCount = updatedRoadsCount; }

    public int getUpdatedPredictionsCount() { return updatedPredictionsCount; }
    public void setUpdatedPredictionsCount(int updatedPredictionsCount) { this.updatedPredictionsCount = updatedPredictionsCount; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
