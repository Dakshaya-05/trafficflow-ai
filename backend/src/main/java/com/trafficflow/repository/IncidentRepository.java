package com.trafficflow.repository;

import com.trafficflow.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatusNotOrderByReportedAtDesc(String status);
    List<Incident> findAllByOrderByReportedAtDesc();
    List<Incident> findByRoadIdAndStatusNot(Long roadId, String status);
}
