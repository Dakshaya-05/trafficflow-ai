package com.trafficflow.controller;

import com.trafficflow.dto.ChatMessageDto;
import com.trafficflow.service.AssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatMessageDto> chat(@Valid @RequestBody ChatMessageDto request) {
        return ResponseEntity.ok(assistantService.processQuery(request));
    }
}
