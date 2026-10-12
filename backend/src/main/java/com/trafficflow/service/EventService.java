package com.trafficflow.service;

import com.trafficflow.model.PublicEvent;
import com.trafficflow.repository.PublicEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final PublicEventRepository publicEventRepository;

    public EventService(PublicEventRepository publicEventRepository) {
        this.publicEventRepository = publicEventRepository;
    }

    public List<PublicEvent> getActiveEvents() {
        return publicEventRepository.findByStatusNotOrderByStartTimeAsc("CONCLUDED");
    }

    public List<PublicEvent> getAllEvents() {
        return publicEventRepository.findAllByOrderByStartTimeAsc();
    }
}
