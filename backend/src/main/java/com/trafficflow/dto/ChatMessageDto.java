package com.trafficflow.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public class ChatMessageDto {

    @NotBlank
    private String message;

    private String response;
    private String sender; // USER or ASSISTANT
    private LocalDateTime timestamp = LocalDateTime.now();
    private List<String> relatedRoads;
    private List<String> suggestions;

    public ChatMessageDto() {}

    public ChatMessageDto(String message) {
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public List<String> getRelatedRoads() { return relatedRoads; }
    public void setRelatedRoads(List<String> relatedRoads) { this.relatedRoads = relatedRoads; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
}
