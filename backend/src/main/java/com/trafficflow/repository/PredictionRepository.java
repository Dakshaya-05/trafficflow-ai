package com.trafficflow.repository;

import com.trafficflow.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByRoadIdOrderByPredictionWindowMinutesAsc(Long roadId);

    @Query("SELECT p FROM Prediction p WHERE p.id IN " +
           "(SELECT MAX(p2.id) FROM Prediction p2 GROUP BY p2.road.id, p2.predictionWindowMinutes)")
    List<Prediction> findLatestPredictions();

    @Query("SELECT p FROM Prediction p WHERE p.road.id = :roadId AND p.id IN " +
           "(SELECT MAX(p2.id) FROM Prediction p2 WHERE p2.road.id = :roadId GROUP BY p2.predictionWindowMinutes) " +
           "ORDER BY p.predictionWindowMinutes ASC")
    List<Prediction> findLatestByRoadId(@Param("roadId") Long roadId);

    List<Prediction> findTop50ByOrderByPredictedAtDesc();
}
