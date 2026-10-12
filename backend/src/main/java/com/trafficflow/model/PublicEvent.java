package com.trafficflow.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "public_events")
public class PublicEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String venue;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "expected_attendance", nullable = false)
    private Integer expectedAttendance;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "affected_roads", columnDefinition = "TEXT", nullable = false)
    private String affectedRoads;

    @Column(nullable = false, length = 30)
    private String status = "ONGOING"; // UPCOMING, ONGOING, CONCLUDED

    public PublicEvent() {}

    public PublicEvent(String name, String venue, Double latitude, Double longitude,
                       Integer expectedAttendance, LocalDateTime startTime, LocalDateTime endTime,
                       String affectedRoads, String status) {
        this.name = name;
        this.venue = venue;
        this.latitude = latitude;
        this.longitude = longitude;
        this.expectedAttendance = expectedAttendance;
        this.startTime = startTime;
        this.endTime = endTime;
        this.affectedRoads = affectedRoads;
        this.status = status != null ? status : "ONGOING";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getExpectedAttendance() { return expectedAttendance; }
    public void setExpectedAttendance(Integer expectedAttendance) { this.expectedAttendance = expectedAttendance; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public String getAffectedRoads() { return affectedRoads; }
    public void setAffectedRoads(String affectedRoads) { this.affectedRoads = affectedRoads; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
