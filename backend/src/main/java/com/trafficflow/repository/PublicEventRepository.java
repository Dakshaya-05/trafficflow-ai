package com.trafficflow.repository;

import com.trafficflow.model.PublicEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicEventRepository extends JpaRepository<PublicEvent, Long> {
    List<PublicEvent> findByStatusNotOrderByStartTimeAsc(String status);
    List<PublicEvent> findAllByOrderByStartTimeAsc();
}
