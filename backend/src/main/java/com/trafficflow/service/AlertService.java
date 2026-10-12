package com.trafficflow.service;

import com.trafficflow.model.Alert;
import com.trafficflow.repository.AlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<Alert> getActiveAlerts() {
        return alertRepository.findByIsDismissedFalseOrderByCreatedAtDesc();
    }

    @Transactional
    public boolean dismissAlert(Long id) {
        return alertRepository.findById(id).map(alert -> {
            alert.setIsDismissed(true);
            alertRepository.save(alert);
            return true;
        }).orElse(false);
    }
}
