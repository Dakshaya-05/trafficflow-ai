package com.trafficflow.controller;

import com.trafficflow.dto.RouteRiskDto;
import com.trafficflow.service.RouteRiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteRiskController {

    private final RouteRiskService routeRiskService;

    public RouteRiskController(RouteRiskService routeRiskService) {
        this.routeRiskService = routeRiskService;
    }

    @GetMapping("/risk")
    public ResponseEntity<RouteRiskDto> getRouteRisk(
            @RequestParam(defaultValue = "Gachibowli") String from,
            @RequestParam(defaultValue = "Hitech City") String to) {
        return ResponseEntity.ok(routeRiskService.calculateRouteRisk(from, to));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<RouteRiskDto>> getPopularRoutes() {
        return ResponseEntity.ok(routeRiskService.getPopularRoutes());
    }
}
