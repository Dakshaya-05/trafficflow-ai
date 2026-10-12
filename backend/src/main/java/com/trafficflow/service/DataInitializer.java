package com.trafficflow.service;

import com.trafficflow.entity.TrafficRecord;
import com.trafficflow.entity.User;
import com.trafficflow.model.*;
import com.trafficflow.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoadRepository roadRepository;
    private final TrafficDataRepository trafficDataRepository;
    private final PredictionRepository predictionRepository;
    private final IncidentRepository incidentRepository;
    private final WeatherDataRepository weatherDataRepository;
    private final PublicEventRepository publicEventRepository;
    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    private final TrafficRecordRepository trafficRecordRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoadRepository roadRepository,
                           TrafficDataRepository trafficDataRepository,
                           PredictionRepository predictionRepository,
                           IncidentRepository incidentRepository,
                           WeatherDataRepository weatherDataRepository,
                           PublicEventRepository publicEventRepository,
                           AlertRepository alertRepository,
                           UserRepository userRepository,
                           TrafficRecordRepository trafficRecordRepository,
                           PasswordEncoder passwordEncoder) {
        this.roadRepository = roadRepository;
        this.trafficDataRepository = trafficDataRepository;
        this.predictionRepository = predictionRepository;
        this.incidentRepository = incidentRepository;
        this.weatherDataRepository = weatherDataRepository;
        this.publicEventRepository = publicEventRepository;
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
        this.trafficRecordRepository = trafficRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedTrafficRecords();
        seedLegacySimulation();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users table already populated. Skipping user seeding.");
            return;
        }

        log.info("Seeding default administrator and traffic operator accounts...");
        User admin = new User(
                "admin",
                "admin@trafficflow.ai",
                passwordEncoder.encode("admin123"),
                "System Administrator",
                "ROLE_ADMIN"
        );

        User officer = new User(
                "traffic_officer",
                "officer@trafficflow.ai",
                passwordEncoder.encode("officer123"),
                "Traffic Operations Officer",
                "ROLE_USER"
        );

        userRepository.saveAll(List.of(admin, officer));
        log.info("Default accounts created: admin (admin123), traffic_officer (officer123)");
    }

    private void seedTrafficRecords() {
        if (trafficRecordRepository.count() > 0) {
            log.info("Traffic records table already populated. Skipping record seeding.");
            return;
        }

        User admin = userRepository.findByUsername("admin").orElse(null);

        log.info("Seeding baseline traffic prediction records...");
        List<TrafficRecord> records = List.of(
                new TrafficRecord(
                        "Gachibowli Junction",
                        1420,
                        21.5,
                        "Rainy",
                        "Evening Rush",
                        "Highway",
                        "HIGH TRAFFIC",
                        0.94,
                        88.5,
                        "Severe congestion predicted. Deploy traffic wardens and redirect transit to Outer Ring Road.",
                        admin
                ),
                new TrafficRecord(
                        "Cyber Towers Madhapur",
                        1280,
                        24.0,
                        "Clear",
                        "Evening Rush",
                        "Arterial",
                        "HIGH TRAFFIC",
                        0.91,
                        82.0,
                        "High density observed during corporate shift end. Activate dynamic signal timing.",
                        admin
                ),
                new TrafficRecord(
                        "Outer Ring Road Exit 19",
                        620,
                        78.5,
                        "Clear",
                        "Afternoon",
                        "Highway",
                        "LOW TRAFFIC",
                        0.96,
                        15.0,
                        "Optimal high-speed flow maintained across all 8 lanes. No bottlenecks anticipated.",
                        admin
                ),
                new TrafficRecord(
                        "Banjara Hills Road No. 1",
                        850,
                        38.0,
                        "Overcast",
                        "Afternoon",
                        "Urban",
                        "MEDIUM TRAFFIC",
                        0.88,
                        46.5,
                        "Moderate vehicle density. Flow steady; monitor hospital intersection for clearance.",
                        admin
                ),
                new TrafficRecord(
                        "Financial District ISB Road",
                        1560,
                        18.0,
                        "Rainy",
                        "Evening Rush",
                        "Arterial",
                        "HIGH TRAFFIC",
                        0.93,
                        91.0,
                        "Critical gridlock. Wet pavement slowing turnaround. Advise alternate corridors.",
                        admin
                ),
                new TrafficRecord(
                        "Kondapur Botanical Garden Road",
                        710,
                        42.0,
                        "Clear",
                        "Morning Rush",
                        "Urban",
                        "MEDIUM TRAFFIC",
                        0.85,
                        41.0,
                        "Normal peak flow. Queue lengths within expected tolerances.",
                        admin
                ),
                new TrafficRecord(
                        "Secunderabad Clock Tower",
                        920,
                        32.0,
                        "Foggy",
                        "Morning Rush",
                        "Arterial",
                        "MEDIUM TRAFFIC",
                        0.87,
                        55.0,
                        "Reduced visibility and metro transit density causing minor friction.",
                        admin
                ),
                new TrafficRecord(
                        "Airport Expressway NH-44",
                        430,
                        85.0,
                        "Clear",
                        "Night",
                        "Highway",
                        "LOW TRAFFIC",
                        0.98,
                        10.0,
                        "Fast flowing corridor with negligible delays. Ideal transit conditions.",
                        admin
                ),
                new TrafficRecord(
                        "Jubilee Hills Check Post",
                        1100,
                        28.0,
                        "Clear",
                        "Evening Rush",
                        "Urban",
                        "HIGH TRAFFIC",
                        0.89,
                        76.0,
                        "Heavy multi-intersection merging. Extend green phase for incoming traffic from KBR Park.",
                        admin
                ),
                new TrafficRecord(
                        "Hitec City Mindspace Circle",
                        520,
                        52.0,
                        "Clear",
                        "Night",
                        "Urban",
                        "LOW TRAFFIC",
                        0.95,
                        18.0,
                        "Off-peak night conditions. Smooth flow with zero reported impediments.",
                        admin
                )
        );

        trafficRecordRepository.saveAll(records);
        log.info("Baseline traffic records seeded (10 sample records across LOW, MEDIUM, and HIGH classes).");
    }

    private void seedLegacySimulation() {
        if (roadRepository.count() > 0) {
            log.info("Simulation roads already seeded. Skipping.");
            return;
        }

        log.info("Seeding realistic demonstration traffic data for Hyderabad city map...");

        // 1. Roads
        Road r1 = new Road(null, "Gachibowli - Hitech City Main Road", "RD-GAC-HIT", "Gachibowli Junction", "Cyber Towers Madhapur", 5.8, 60,
                "[[17.4401, 78.3489], [17.4425, 78.3580], [17.4450, 78.3680], [17.4474, 78.3762], [17.4505, 78.3820]]",
                17.4450, 78.3680, "IT Corridor");
        Road r2 = new Road(null, "Outer Ring Road (ORR West)", "RD-ORR-WEST", "Gachibowli Financial District", "Shamshabad Interchange", 24.2, 100,
                "[[17.4200, 78.3300], [17.3950, 78.3450], [17.3600, 78.3750], [17.3100, 78.4000], [17.2500, 78.4200]]",
                17.3600, 78.3750, "Outer Expressway");
        Road r3 = new Road(null, "Banjara Hills Road No. 1 & 12", "RD-BANJ-01", "Masab Tank", "Jubilee Hills Check Post", 7.4, 50,
                "[[17.4080, 78.4480], [17.4150, 78.4350], [17.4220, 78.4220], [17.4280, 78.4100]]",
                17.4180, 78.4280, "Central");
        Road r4 = new Road(null, "PVNR Elevated Expressway", "RD-PVNR-EXP", "Sarojini Devi Eye Hospital", "Aramgarh Junction", 11.6, 80,
                "[[17.3950, 78.4450], [17.3750, 78.4480], [17.3500, 78.4490], [17.3200, 78.4460]]",
                17.3600, 78.4470, "Airport Connector");
        Road r5 = new Road(null, "Madhapur 100 Feet Road", "RD-MADH-100", "Cyber Towers", "Jubilee Hills Road 36", 4.2, 50,
                "[[17.4505, 78.3820], [17.4440, 78.3910], [17.4380, 78.4010]]",
                17.4440, 78.3910, "IT Corridor");
        Road r6 = new Road(null, "Kavuri Hills to Durgam Cheruvu Cable Bridge", "RD-DURGAM-CB", "Madhapur Police Station", "Jubilee Hills Road 45", 3.1, 50,
                "[[17.4380, 78.3860], [17.4340, 78.3920], [17.4310, 78.4010]]",
                17.4340, 78.3920, "Bridge");
        Road r7 = new Road(null, "Jubilee Hills Road No. 36", "RD-JUB-36", "Peddamma Temple", "Madhapur Metro", 4.9, 50,
                "[[17.4300, 78.4100], [17.4360, 78.3980], [17.4420, 78.3880]]",
                17.4360, 78.3980, "Commercial");
        Road r8 = new Road(null, "Financial District ISB Road", "RD-FINDIST-01", "Wipro Circle", "Q-City Nanakramguda", 6.1, 60,
                "[[17.4180, 78.3420], [17.4120, 78.3510], [17.4080, 78.3620]]",
                17.4120, 78.3510, "Corporate");
        Road r9 = new Road(null, "Kondapur Botanical Garden Road", "RD-KOND-BOT", "Kothaguda Junction", "Gachibowli Stadium", 4.5, 50,
                "[[17.4580, 78.3620], [17.4510, 78.3580], [17.4440, 78.3510]]",
                17.4510, 78.3580, "Connector");
        Road r10 = new Road(null, "Begumpet - Secunderabad Corridor", "RD-BEGUM-SEC", "Punjagutta Flyover", "Secunderabad Station", 8.2, 50,
                "[[17.4260, 78.4520], [17.4380, 78.4680], [17.4420, 78.4850], [17.4340, 78.5010]]",
                17.4380, 78.4750, "Historic Metro");
        Road r11 = new Road(null, "Kukatpally - Miyapur NH65 Corridor", "RD-KUKAT-MIY", "Bharat Nagar Flyover", "Miyapur X Roads", 9.4, 60,
                "[[17.4680, 78.4200], [17.4850, 78.3980], [17.4950, 78.3650]]",
                17.4850, 78.3980, "Northwest Arterial");
        Road r12 = new Road(null, "Mehdipatnam - Lakdikapul Major Arterial", "RD-MEHDI-LAK", "Rethi Bowli Junction", "Saifabad Police Station", 6.8, 50,
                "[[17.3910, 78.4410], [17.3990, 78.4550], [17.4040, 78.4670]]",
                17.3990, 78.4550, "Central Inbound");

        List<Road> savedRoads = roadRepository.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12));

        // 2. Traffic data
        trafficDataRepository.saveAll(List.of(
                new TrafficData(savedRoads.get(0), 1620, 18.4, "HIGH", 980, 0.72),
                new TrafficData(savedRoads.get(1), 840, 76.5, "LOW", 1100, 0.18),
                new TrafficData(savedRoads.get(2), 1180, 26.2, "HIGH", 750, 0.65),
                new TrafficData(savedRoads.get(3), 790, 68.0, "LOW", 850, 0.22),
                new TrafficData(savedRoads.get(4), 1410, 14.8, "SEVERE", 700, 0.88),
                new TrafficData(savedRoads.get(5), 930, 31.0, "MODERATE", 620, 0.48),
                new TrafficData(savedRoads.get(6), 1050, 29.5, "MODERATE", 690, 0.44),
                new TrafficData(savedRoads.get(7), 1540, 19.8, "HIGH", 880, 0.76),
                new TrafficData(savedRoads.get(8), 810, 36.4, "MODERATE", 600, 0.38),
                new TrafficData(savedRoads.get(9), 1320, 22.1, "HIGH", 910, 0.68),
                new TrafficData(savedRoads.get(10), 1480, 32.5, "MODERATE", 1020, 0.52),
                new TrafficData(savedRoads.get(11), 1390, 20.4, "HIGH", 820, 0.71)
        ));

        // 3. Incidents
        incidentRepository.saveAll(List.of(
                new Incident("ACCIDENT", savedRoads.get(0), "Bio-Diversity flyover down-ramp",
                        17.4435, 78.3620, "Multi-car collision on Bio-Diversity flyover down-ramp", "HIGH", "ACTIVE", LocalDateTime.now().plusHours(1)),
                new Incident("ROAD_WORK", savedRoads.get(4), "Madhapur 100 Feet Road",
                        17.4460, 78.3880, "Underground fiber utility trenching work blockading lane 2", "MODERATE", "ACTIVE", LocalDateTime.now().plusHours(2)),
                new Incident("ROAD_CLOSURE", savedRoads.get(2), "Care Hospital Banjara Hills",
                        17.4160, 78.4320, "Heavy water-logging near Care Hospital Banjara Hills", "HIGH", "ACTIVE", LocalDateTime.now().plusHours(3)),
                new Incident("ACCIDENT", savedRoads.get(7), "Wipro Junction turn",
                        17.4140, 78.3480, "Heavy Volvo corporate bus stall at Wipro Junction turn", "MODERATE", "ACTIVE", LocalDateTime.now().plusHours(1))
        ));

        // 4. Weather
        weatherDataRepository.saveAll(List.of(
                new WeatherData("Hyderabad IT Corridor", 26.5, 14.2, 88.0, "Rainy", "WET", 3.2),
                new WeatherData("Shamshabad Airport Area", 28.0, 1.5, 74.0, "Overcast", "DRY", 8.5),
                new WeatherData("Secunderabad Central", 27.0, 8.8, 82.0, "Rainy", "WET", 4.5)
        ));

        // 5. Events
        publicEventRepository.saveAll(List.of(
                new PublicEvent("Hyderabad Global Tech Summit 2026", "HICC Novotel Madhapur",
                        17.4520, 78.3750, 18000, LocalDateTime.now().minusHours(4), LocalDateTime.now().plusHours(2),
                        "Madhapur 100 Feet Road, Hitech City Main Road", "ONGOING"),
                new PublicEvent("Gachibowli Mega Live Arena Concert", "Gachibowli Athletic Stadium",
                        17.4440, 78.3510, 26000, LocalDateTime.now().minusHours(1), LocalDateTime.now().plusHours(4),
                        "Gachibowli - Hitech City Main Road, Botanical Garden Road", "ONGOING"),
                new PublicEvent("Marathon Expo & City Fun Run", "Jubilee Hills KBR National Park",
                        17.4220, 78.4200, 6500, LocalDateTime.now().minusHours(3), LocalDateTime.now().plusMinutes(45),
                        "Banjara Hills Road No. 1 & 12, Jubilee Hills Road 36", "ONGOING")
        ));

        // 6. Predictions
        predictionRepository.saveAll(List.of(
                new Prediction(savedRoads.get(0), 30, "HIGH", 84.5, 0.91, 16.5, 1750,
                        "[\"Traffic volume 65% above historical normal\", \"Live incident on flyover down-ramp\", \"Heavy rainfall (14.2 mm)\", \"Mega concert egress nearby\"]",
                        "High congestion predicted on Gachibowli-Hitech City road in 30 minutes. Traffic volume increasing rapidly following evening shifts."),
                new Prediction(savedRoads.get(1), 30, "LOW", 18.0, 0.95, 74.0, 890,
                        "[\"Optimal lane velocity\", \"Dry expressway surface\", \"Historical clear run\"]",
                        "Low congestion predicted on ORR West in 30 minutes. Freeway speeds stable at 75+ km/h."),
                new Prediction(savedRoads.get(4), 30, "SEVERE", 92.0, 0.88, 11.0, 1620,
                        "[\"Utility trenching narrowing bottleneck to 1 lane\", \"HICC conference outflow active\", \"Rainwater puddling\"]",
                        "Severe gridlock imminent on Madhapur 100 Feet Road within 30 minutes. Route diversion recommended via Inorbit Mall ring.")
        ));

        // 7. Alerts
        alertRepository.saveAll(List.of(
                new Alert(savedRoads.get(0), "HIGH_RISK", "Severe Gridlock Imminent on Gachibowli - Hitech City Road",
                        "Traffic model predicts severe congestion within 30 minutes. Factors: Major concert at Gachibowli Stadium + Flyover accident + Heavy rain.", "SEVERE"),
                new Alert(savedRoads.get(4), "HIGH_RISK", "Critical Bottle-neck on Madhapur 100 Feet Road",
                        "Emergency drainage repair at Inorbit pillar 114 narrowing road to single lane. Delay exceeding 25 minutes expected.", "HIGH")
        ));

        log.info("Database seeding complete: roads, traffic records, users, and simulation models loaded.");
    }
}
