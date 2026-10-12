package com.trafficflow.controller;

import com.trafficflow.dto.MessageResponse;
import com.trafficflow.dto.RoadTrafficDto;
import com.trafficflow.dto.TrafficPredictRequestDto;
import com.trafficflow.dto.TrafficPredictResponseDto;
import com.trafficflow.model.TrafficData;
import com.trafficflow.service.TrafficRecordService;
import com.trafficflow.service.TrafficService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/traffic")
public class TrafficController {

    private final TrafficService trafficService;
    private final TrafficRecordService trafficRecordService;

    public TrafficController(TrafficService trafficService, TrafficRecordService trafficRecordService) {
        this.trafficService = trafficService;
        this.trafficRecordService = trafficRecordService;
    }

    /**
     * AI-based traffic prediction endpoint.
     * Evaluates traffic parameters and saves record with risk category and recommendations.
     */
    @PostMapping("/predict")
    public ResponseEntity<TrafficPredictResponseDto> predictTraffic(
            @Valid @RequestBody TrafficPredictRequestDto requestDto,
            Authentication authentication) {
        String username = (authentication != null) ? authentication.getName() : null;
        TrafficPredictResponseDto response = trafficRecordService.predictAndSave(requestDto, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Paginated traffic history with location search and category filtering.
     */
    @GetMapping("/history")
    public ResponseEntity<Page<TrafficPredictResponseDto>> getHistory(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = "asc".equalsIgnoreCase(direction) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TrafficPredictResponseDto> results = trafficRecordService.getHistory(search, level, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * Get single traffic record by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TrafficPredictResponseDto> getTrafficRecordById(@PathVariable Long id) {
        TrafficPredictResponseDto result = trafficRecordService.getById(id);
        return ResponseEntity.ok(result);
    }

    /**
     * Delete traffic record by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteTrafficRecord(@PathVariable Long id) {
        trafficRecordService.deleteById(id);
        return ResponseEntity.ok(MessageResponse.of("Traffic record #" + id + " successfully deleted."));
    }

    // --- Legacy / Live Map Endpoints preserved for city simulation ---

    @GetMapping("/roads")
    public ResponseEntity<List<RoadTrafficDto>> getAllRoads() {
        return ResponseEntity.ok(trafficService.getAllRoadsWithTraffic());
    }

    @GetMapping("/roads/{id}")
    public ResponseEntity<RoadTrafficDto> getRoadById(@PathVariable Long id) {
        return ResponseEntity.ok(trafficService.getRoadTrafficById(id));
    }

    @GetMapping("/current")
    public ResponseEntity<List<TrafficData>> getCurrentTraffic() {
        return ResponseEntity.ok(trafficService.getCurrentTraffic());
    }

    @GetMapping("/roads/{id}/history")
    public ResponseEntity<List<TrafficData>> getHistoryForRoad(@PathVariable Long id) {
        return ResponseEntity.ok(trafficService.getHistoryForRoad(id));
    }
}
