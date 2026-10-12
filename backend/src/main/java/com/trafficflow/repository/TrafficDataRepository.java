package com.trafficflow.repository;

import com.trafficflow.model.TrafficData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrafficDataRepository extends JpaRepository<TrafficData, Long> {
    List<TrafficData> findByRoadIdOrderByRecordedAtDesc(Long roadId);

    @Query("SELECT td FROM TrafficData td WHERE td.road.id = :roadId ORDER BY td.recordedAt DESC LIMIT 1")
    Optional<TrafficData> findLatestByRoadId(@Param("roadId") Long roadId);

    @Query("SELECT td FROM TrafficData td WHERE td.id IN " +
           "(SELECT MAX(t.id) FROM TrafficData t GROUP BY t.road.id)")
    List<TrafficData> findLatestTrafficForAllRoads();

    List<TrafficData> findTop100ByOrderByRecordedAtDesc();
}
