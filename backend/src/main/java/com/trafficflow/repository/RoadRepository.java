package com.trafficflow.repository;

import com.trafficflow.model.Road;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadRepository extends JpaRepository<Road, Long> {
    Optional<Road> findByCode(String code);
    Optional<Road> findByNameContainingIgnoreCase(String name);
}
