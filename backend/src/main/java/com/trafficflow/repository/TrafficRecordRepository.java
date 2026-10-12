package com.trafficflow.repository;

import com.trafficflow.entity.TrafficRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrafficRecordRepository extends JpaRepository<TrafficRecord, Long> {

    Page<TrafficRecord> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    Page<TrafficRecord> findByPredictedTrafficLevel(String level, Pageable pageable);

    Page<TrafficRecord> findByLocationContainingIgnoreCaseAndPredictedTrafficLevel(
            String location, String level, Pageable pageable
    );

    Page<TrafficRecord> findByUserId(Long userId, Pageable pageable);

    Long countByPredictedTrafficLevel(String level);

    @Query("SELECT AVG(tr.averageSpeed) FROM TrafficRecord tr")
    Double findAverageSpeed();

    @Query("SELECT SUM(tr.vehicleCount) FROM TrafficRecord tr")
    Long findTotalVehicleCount();

    List<TrafficRecord> findTop10ByOrderByCreatedAtDesc();
}
