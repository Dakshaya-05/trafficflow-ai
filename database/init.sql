-- ==============================================================================
-- TRAFFICFLOW AI - Database Initialization Script
-- Simulated Traffic Data for Hyderabad Demonstration
-- DISCLAIMER: All data is simulated for demonstration purposes.
-- ==============================================================================

-- Drop tables if exist
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS traffic_data CASCADE;
DROP TABLE IF EXISTS public_events CASCADE;
DROP TABLE IF EXISTS weather_data CASCADE;
DROP TABLE IF EXISTS roads CASCADE;

-- 1. ROADS TABLE
CREATE TABLE roads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    start_location VARCHAR(100) NOT NULL,
    end_location VARCHAR(100) NOT NULL,
    length_km DOUBLE PRECISION NOT NULL,
    speed_limit_kmh INT NOT NULL,
    coordinates TEXT NOT NULL, -- JSON array of [lat, lng] coordinates
    center_lat DOUBLE PRECISION NOT NULL,
    center_lng DOUBLE PRECISION NOT NULL,
    zone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TRAFFIC DATA TABLE
CREATE TABLE traffic_data (
    id SERIAL PRIMARY KEY,
    road_id INT REFERENCES roads(id) ON DELETE CASCADE,
    traffic_volume INT NOT NULL,
    average_speed DOUBLE PRECISION NOT NULL,
    congestion_level VARCHAR(20) NOT NULL, -- LOW, MODERATE, HIGH, SEVERE
    historical_average_volume INT NOT NULL,
    occupancy_rate DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PREDICTIONS TABLE
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    road_id INT REFERENCES roads(id) ON DELETE CASCADE,
    prediction_window_minutes INT NOT NULL, -- 15, 30, 45, 60
    predicted_congestion VARCHAR(20) NOT NULL, -- LOW, MODERATE, HIGH, SEVERE
    risk_score DOUBLE PRECISION NOT NULL, -- 0 - 100
    confidence DOUBLE PRECISION NOT NULL, -- 0.0 - 1.0
    predicted_speed DOUBLE PRECISION NOT NULL,
    predicted_volume INT NOT NULL,
    factors TEXT NOT NULL, -- JSON array of string factors
    explanation TEXT NOT NULL,
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. INCIDENTS TABLE
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL, -- ACCIDENT, ROAD_WORK, WEATHER, EVENT, ROAD_CLOSURE
    road_id INT REFERENCES roads(id) ON DELETE SET NULL,
    location_name VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- LOW, MODERATE, HIGH, SEVERE
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, RESOLVING, RESOLVED
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_clearance_at TIMESTAMP
);

-- 5. WEATHER DATA TABLE
CREATE TABLE weather_data (
    id SERIAL PRIMARY KEY,
    city VARCHAR(50) NOT NULL DEFAULT 'Hyderabad',
    temperature DOUBLE PRECISION NOT NULL,
    rainfall_mm DOUBLE PRECISION NOT NULL,
    humidity DOUBLE PRECISION NOT NULL,
    condition VARCHAR(50) NOT NULL,
    road_condition VARCHAR(30) NOT NULL, -- DRY, WET, FLOODED, SLIPPERY
    visibility_km DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. PUBLIC EVENTS TABLE
CREATE TABLE public_events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    expected_attendance INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    affected_roads TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ONGOING'
);

-- 7. ALERTS TABLE
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    road_id INT REFERENCES roads(id) ON DELETE SET NULL,
    alert_type VARCHAR(30) NOT NULL, -- HIGH_RISK, MODERATE_RISK, INCIDENT, WEATHER_WARNING
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- LOW, MODERATE, HIGH, SEVERE
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- SEED DATA (Demonstration / Simulated Data for Hyderabad)
-- ==============================================================================

-- Seed 12 Roads
INSERT INTO roads (id, name, code, start_location, end_location, length_km, speed_limit_kmh, coordinates, center_lat, center_lng, zone) VALUES
(1, 'Gachibowli - Hitech City Main Road', 'RD-GAC-HIT', 'Gachibowli Junction', 'Cyber Towers Madhapur', 5.8, 60,
 '[[17.4401, 78.3489], [17.4425, 78.3580], [17.4450, 78.3680], [17.4474, 78.3762], [17.4505, 78.3820]]',
 17.4450, 78.3680, 'IT Corridor'),

(2, 'Outer Ring Road (ORR West)', 'RD-ORR-WEST', 'Gachibowli Financial District', 'Shamshabad Interchange', 24.2, 100,
 '[[17.4200, 78.3300], [17.3950, 78.3450], [17.3600, 78.3750], [17.3100, 78.4000], [17.2500, 78.4200]]',
 17.3600, 78.3750, 'Outer Expressway'),

(3, 'Banjara Hills Road No. 1 & 12', 'RD-BANJ-01', 'Masab Tank', 'Jubilee Hills Check Post', 7.4, 50,
 '[[17.4080, 78.4480], [17.4150, 78.4350], [17.4220, 78.4220], [17.4280, 78.4100]]',
 17.4180, 78.4280, 'Central'),

(4, 'PVNR Airport Elevated Expressway', 'RD-PVNR-EXP', 'Mehdipatnam Sarojini Eye Hospital', 'Aramghar Junction', 11.6, 80,
 '[[17.3916, 78.4410], [17.3700, 78.4400], [17.3400, 78.4380], [17.3180, 78.4350]]',
 17.3550, 78.4390, 'Airport Corridor'),

(5, 'Madhapur 100 Feet Road', 'RD-MADH-100', 'Inorbit Mall', 'Hi-Tech City MMTS Station', 4.2, 50,
 '[[17.4335, 78.3860], [17.4410, 78.3840], [17.4490, 78.3810], [17.4580, 78.3780]]',
 17.4450, 78.3830, 'IT Corridor'),

(6, 'NH-44 Hyderabad - Medchal Highway', 'RD-NH44-MED', 'Bowenpally Check Post', 'Medchal Outer Junction', 18.5, 80,
 '[[17.4700, 78.4850], [17.5100, 78.4900], [17.5500, 78.4920], [17.6200, 78.4950]]',
 17.5300, 78.4900, 'North Corridor'),

(7, 'Jubilee Hills Road No. 36', 'RD-JUB-36', 'Peddamma Gudi Temple', 'Madhapur Kavuri Hills', 3.9, 50,
 '[[17.4319, 78.4073], [17.4360, 78.3990], [17.4390, 78.3910], [17.4420, 78.3850]]',
 17.4360, 78.3990, 'Central'),

(8, 'Financial District ISB Road', 'RD-FIN-ISB', 'Wipro Circle Gachibowli', 'Nanakramguda Circle', 4.8, 60,
 '[[17.4220, 78.3410], [17.4160, 78.3490], [17.4120, 78.3580], [17.4100, 78.3690]]',
 17.4150, 78.3540, 'IT Corridor'),

(9, 'Kondapur Botanical Garden Road', 'RD-KON-BOT', 'Kothaguda Junction', 'Miyapur Metro Station', 5.1, 50,
 '[[17.4580, 78.3610], [17.4690, 78.3580], [17.4820, 78.3550], [17.4950, 78.3520]]',
 17.4750, 78.3570, 'North-West Corridor'),

(10, 'Begumpet - Secunderabad Corridor', 'RD-BEG-SEC', 'Punjagutta Flyover', 'Secunderabad Station Road', 6.5, 50,
 '[[17.4270, 78.4520], [17.4380, 78.4650], [17.4440, 78.4780], [17.4420, 78.4980]]',
 17.4380, 78.4700, 'Central'),

(11, 'Kukatpally Y-Junction to JNTU Road', 'RD-KUK-JNTU', 'Moosapet Y-Junction', 'JNTU Hyderabad Metro', 6.0, 60,
 '[[17.4680, 78.4280], [17.4810, 78.4120], [17.4947, 78.3996], [17.5020, 78.3880]]',
 17.4860, 78.4100, 'North-West Corridor'),

(12, 'Mehdipatnam to Lakdikapul Road', 'RD-MEH-LAK', 'Mehdipatnam Rythu Bazar', 'Lakdikapul Metro', 4.5, 50,
 '[[17.3916, 78.4410], [17.3980, 78.4520], [17.4040, 78.4620]]',
 17.3980, 78.4520, 'Central');

-- Seed Weather Data
INSERT INTO weather_data (id, city, temperature, rainfall_mm, humidity, condition, road_condition, visibility_km) VALUES
(1, 'Hyderabad', 26.5, 14.2, 86.0, 'Moderate Rain', 'WET', 6.2);

-- Seed Public Events
INSERT INTO public_events (id, name, venue, latitude, longitude, expected_attendance, start_time, end_time, affected_roads, status) VALUES
(1, 'International Tech Conclave 2026', 'HICC Novotel Madhapur', 17.4720, 78.3740, 18000, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '3 hours', 'Gachibowli - Hitech City Main Road, Madhapur 100 Feet Road', 'ONGOING'),
(2, 'Major Concert at Gachibowli Stadium', 'Gachibowli Indoor Stadium', 17.4430, 78.3450, 26000, CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '5 hours', 'Gachibowli - Hitech City Main Road, Financial District ISB Road, Outer Ring Road', 'UPCOMING'),
(3, 'IPL Cricket Match: SRH vs CSK', 'Rajiv Gandhi Stadium Uppal', 17.4060, 78.5500, 38000, CURRENT_TIMESTAMP + INTERVAL '2 hours', CURRENT_TIMESTAMP + INTERVAL '6 hours', 'Begumpet - Secunderabad Corridor, NH-44', 'UPCOMING'),
(4, 'Hyderabad Marathon 10K Run', 'Jubilee Hills Road 36', 17.4320, 78.4070, 8500, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP + INTERVAL '1 hour', 'Jubilee Hills Road No. 36, Banjara Hills Road No. 1 & 12', 'RESOLVING'),
(5, 'Food & Culture Expo 2026', 'Hitex Exhibition Grounds', 17.4690, 78.3720, 12000, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP + INTERVAL '4 hours', 'Madhapur 100 Feet Road, Kondapur Botanical Garden Road', 'ONGOING');

-- Seed Incidents
INSERT INTO incidents (id, type, road_id, location_name, latitude, longitude, description, severity, status, reported_at, estimated_clearance_at) VALUES
(1, 'ACCIDENT', 1, 'Gachibowli Flyover ramp towards Cyber Towers', 17.4425, 78.3580, 'Two-car collision blocking the right lane. Traffic moving slowly on remaining lane.', 'HIGH', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '22 minutes', CURRENT_TIMESTAMP + INTERVAL '40 minutes'),
(2, 'ROAD_WORK', 5, 'Madhapur 100 Feet Road near Inorbit Metro Pillar 114', 17.4370, 78.3850, 'Emergency drainage repair due to heavy rain overflow. Half roadway barricaded.', 'MODERATE', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP + INTERVAL '2 hours'),
(3, 'WEATHER', 3, 'Banjara Hills Road No. 1 near Care Hospital', 17.4150, 78.4350, 'Waterlogging reported at low-lying intersection. Vehicles crawling at 15 km/h.', 'HIGH', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '35 minutes', CURRENT_TIMESTAMP + INTERVAL '45 minutes'),
(4, 'ROAD_CLOSURE', 7, 'Jubilee Hills Road No. 36 Peddamma Temple stretch', 17.4330, 78.4030, 'VIP convoy clearance and diversion for Marathon assembly.', 'MODERATE', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '40 minutes', CURRENT_TIMESTAMP + INTERVAL '20 minutes'),
(5, 'ACCIDENT', 2, 'Outer Ring Road Shamshabad Exit 14', 17.2900, 78.4100, 'Stalled heavy transport lorry on shoulder with oil spill warning.', 'LOW', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '15 minutes', CURRENT_TIMESTAMP + INTERVAL '60 minutes'),
(6, 'EVENT', 8, 'Financial District near Wipro Circle', 17.4190, 78.3440, 'Sudden influx of 4,000 corporate buses exiting campus simultaneous shifts.', 'MODERATE', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '10 minutes', CURRENT_TIMESTAMP + INTERVAL '50 minutes'),
(7, 'WEATHER', 9, 'Kondapur Botanical Garden Road', 17.4690, 78.3580, 'Uprooted tree branch obstructing pedestrian lane and narrowing motor lane.', 'LOW', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '50 minutes', CURRENT_TIMESTAMP + INTERVAL '30 minutes'),
(8, 'ROAD_WORK', 11, 'Kukatpally Y-Junction flyover expansion', 17.4750, 78.4200, 'Pothole restoration and asphalt layering under intermittent rainfall.', 'MODERATE', 'ACTIVE', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP + INTERVAL '3 hours'),
(9, 'ACCIDENT', 4, 'PVNR Airport Expressway Ramp 3', 17.3620, 78.4390, 'Rear-end bump between cab and SUV. Patrol vehicle on site directing traffic.', 'MODERATE', 'RESOLVING', CURRENT_TIMESTAMP - INTERVAL '30 minutes', CURRENT_TIMESTAMP + INTERVAL '10 minutes'),
(10, 'ACCIDENT', 10, 'Begumpet Old Airport flyover', 17.4410, 78.4720, 'Two-wheeler skid due to wet asphalt. Medical assistance attended.', 'LOW', 'RESOLVING', CURRENT_TIMESTAMP - INTERVAL '45 minutes', CURRENT_TIMESTAMP + INTERVAL '5 minutes');

-- Seed Current & Recent Traffic Data (50+ records across roads)
INSERT INTO traffic_data (road_id, traffic_volume, average_speed, congestion_level, historical_average_volume, occupancy_rate, recorded_at) VALUES
(1, 1420, 24.5, 'HIGH', 950, 0.88, CURRENT_TIMESTAMP),
(1, 1380, 26.0, 'HIGH', 950, 0.85, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(1, 1250, 31.0, 'MODERATE', 950, 0.76, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(1, 1100, 38.0, 'MODERATE', 950, 0.65, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(2, 2150, 72.0, 'LOW', 2200, 0.42, CURRENT_TIMESTAMP),
(2, 2200, 74.0, 'LOW', 2200, 0.44, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(2, 2300, 68.0, 'LOW', 2200, 0.46, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(2, 2100, 76.0, 'LOW', 2200, 0.41, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(3, 1180, 22.0, 'HIGH', 780, 0.84, CURRENT_TIMESTAMP),
(3, 1120, 24.0, 'HIGH', 780, 0.81, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(3, 990, 30.0, 'MODERATE', 780, 0.70, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(3, 890, 35.0, 'MODERATE', 780, 0.62, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(4, 1650, 62.0, 'MODERATE', 1400, 0.58, CURRENT_TIMESTAMP),
(4, 1590, 65.0, 'MODERATE', 1400, 0.55, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(4, 1500, 68.0, 'LOW', 1400, 0.50, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(4, 1450, 70.0, 'LOW', 1400, 0.48, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(5, 1280, 18.5, 'SEVERE', 820, 0.94, CURRENT_TIMESTAMP),
(5, 1210, 21.0, 'HIGH', 820, 0.89, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(5, 1080, 26.0, 'HIGH', 820, 0.79, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(5, 950, 33.0, 'MODERATE', 820, 0.68, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(6, 1850, 58.0, 'LOW', 1700, 0.45, CURRENT_TIMESTAMP),
(6, 1780, 60.0, 'LOW', 1700, 0.43, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(6, 1720, 62.0, 'LOW', 1700, 0.41, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(6, 1690, 64.0, 'LOW', 1700, 0.40, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(7, 980, 28.0, 'MODERATE', 750, 0.68, CURRENT_TIMESTAMP),
(7, 920, 30.0, 'MODERATE', 750, 0.64, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(7, 860, 34.0, 'MODERATE', 750, 0.58, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(7, 810, 38.0, 'LOW', 750, 0.52, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(8, 1450, 25.0, 'HIGH', 980, 0.86, CURRENT_TIMESTAMP),
(8, 1390, 27.0, 'HIGH', 980, 0.82, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(8, 1220, 34.0, 'MODERATE', 980, 0.71, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(8, 1050, 42.0, 'MODERATE', 980, 0.60, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(9, 890, 32.0, 'MODERATE', 710, 0.62, CURRENT_TIMESTAMP),
(9, 840, 35.0, 'MODERATE', 710, 0.58, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(9, 790, 38.0, 'LOW', 710, 0.52, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(9, 740, 42.0, 'LOW', 710, 0.48, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(10, 1550, 26.0, 'HIGH', 1200, 0.79, CURRENT_TIMESTAMP),
(10, 1480, 28.0, 'MODERATE', 1200, 0.75, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(10, 1360, 33.0, 'MODERATE', 1200, 0.68, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(10, 1250, 38.0, 'LOW', 1200, 0.61, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(11, 1620, 31.0, 'MODERATE', 1350, 0.74, CURRENT_TIMESTAMP),
(11, 1580, 32.0, 'MODERATE', 1350, 0.72, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(11, 1490, 36.0, 'MODERATE', 1350, 0.67, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(11, 1400, 42.0, 'LOW', 1350, 0.60, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),

(12, 1380, 21.0, 'HIGH', 950, 0.85, CURRENT_TIMESTAMP),
(12, 1310, 23.0, 'HIGH', 950, 0.81, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(12, 1190, 28.0, 'MODERATE', 950, 0.72, CURRENT_TIMESTAMP - INTERVAL '20 minutes'),
(12, 1070, 34.0, 'MODERATE', 950, 0.63, CURRENT_TIMESTAMP - INTERVAL '30 minutes');

-- Seed Predictions (For 15, 30, 45, 60 minutes)
INSERT INTO predictions (road_id, prediction_window_minutes, predicted_congestion, risk_score, confidence, predicted_speed, predicted_volume, factors, explanation) VALUES
(1, 15, 'HIGH', 82.0, 0.88, 20.5, 1530,
 '["Volume +49% vs historic baseline", "Active accident at Gachibowli flyover", "Wet road friction index 0.61", "Peak evening IT exit influx"]',
 'High congestion predicted in 15 minutes because traffic volume is surging 49% above historical levels, an active accident has blocked one lane at Gachibowli flyover, and wet roads are reducing safe cruising speeds.'),

(1, 30, 'SEVERE', 94.0, 0.91, 14.0, 1720,
 '["Concert crowd converging at Gachibowli Stadium", "Accident bottleneck compounding", "Ongoing rainfall 14.2mm", "Upstream bottleneck on Financial District road"]',
 'Severe gridlock predicted in 30 minutes because 26,000 concert-goers will converge towards Gachibowli Stadium while the unresolved flyover incident throttles vehicle clearance.'),

(1, 45, 'SEVERE', 91.0, 0.87, 16.5, 1680,
 '["Peak concert arrival window", "Rain waterlogging near biodiverse park junction", "Spillover from HICC conclave egress"]',
 'Severe congestion expected to persist through 45 minutes as both tech conclave egress and stadium attendance peak concurrently.'),

(1, 60, 'HIGH', 78.0, 0.82, 23.0, 1420,
 '["Incident clearance anticipated", "Concert gates scheduled closing", "Residual queue dissipation"]',
 'Congestion will ease from severe to high in 60 minutes as emergency responders clear the flyover accident and concert attendees enter the venue.'),

(3, 30, 'SEVERE', 88.0, 0.89, 16.0, 1350,
 '["Waterlogging at low-lying intersection", "Rainfall rate 14.2 mm/h", "Traffic volume +51% above normal", "Marathon route diversion backlog"]',
 'Severe congestion predicted on Banjara Hills Road No. 1 in 30 minutes due to deepening waterlogging at the Care Hospital junction coupled with traffic diverted from Jubilee Hills Road 36.'),

(5, 30, 'SEVERE', 95.0, 0.93, 12.0, 1480,
 '["Drainage repair barricade near Inorbit", "Spillover traffic from Cyber Towers", "Conclave exit traffic from HICC", "Continuous rainfall"]',
 'Severe gridlock predicted on Madhapur 100 Feet Road in 30 minutes because emergency drainage excavation blocks half the carriageway during peak conference dispersal.'),

(8, 30, 'HIGH', 81.0, 0.85, 21.0, 1600,
 '["4,000 corporate buses exiting simultaneously", "Stadium concert approach corridor", "Intermittent drizzle"]',
 'High congestion predicted on Financial District ISB Road in 30 minutes driven by massive corporate shift end combined with concert traffic routing.'),

(12, 30, 'HIGH', 77.0, 0.84, 18.0, 1490,
 '["Wet pavement and braking distance caution", "Rush hour inbound to Lakdikapul metro hub", "Volume +45% above average"]',
 'High congestion predicted on Mehdipatnam-Lakdikapul corridor in 30 minutes due to wet road conditions and heavy commuter transit demand.'),

(2, 30, 'LOW', 25.0, 0.94, 76.0, 2250,
 '["High expressway design capacity", "Smooth transit velocity on 8-lane corridor", "Accident isolated to shoulder"]',
 'Low risk predicted on Outer Ring Road West in 30 minutes as wide multi-lane geometry absorbs current demand with minor shoulder obstruction.'),

(4, 30, 'MODERATE', 56.0, 0.87, 58.0, 1720,
 '["Slight slowdown at Mehdipatnam approach ramp", "Minor cab incident clearance underway", "Moderate airport shuttle volume"]',
 'Moderate congestion predicted on PVNR Airport Expressway in 30 minutes as ramp incident clearance completes while steady airport traffic flows.'),

(6, 30, 'LOW', 22.0, 0.92, 62.0, 1820,
 '["Favorable highway throughput", "No reported incidents along Medchal stretch", "Moderate weather impact"]',
 'Low congestion predicted on NH-44 Medchal Highway in 30 minutes with steady open-throttle transit.'),

(7, 30, 'MODERATE', 62.0, 0.83, 26.0, 1040,
 '["Marathon pack up in final stage", "Peddamma Gudi evening devotee movement", "Pavement wet from rainfall"]',
 'Moderate congestion predicted on Jubilee Hills Road 36 in 30 minutes as marathon barricades are dismantled and normal traffic restores.');

-- Seed Alerts
INSERT INTO alerts (road_id, alert_type, title, message, severity, is_dismissed) VALUES
(1, 'HIGH_RISK', 'Severe Gridlock Imminent on Gachibowli - Hitech City Road', 'Traffic model predicts severe congestion within 30 minutes. Factors: Major concert at Gachibowli Stadium (26k attendees) + Flyover accident + Heavy rain.', 'SEVERE', FALSE),
(5, 'HIGH_RISK', 'Critical Bottle-neck on Madhapur 100 Feet Road', 'Emergency drainage repair at Inorbit pillar 114 narrowing road to single lane. Delay exceeding 25 minutes expected.', 'HIGH', FALSE),
(3, 'INCIDENT', 'Deep Waterlogging on Banjara Hills Road No. 1', 'Water accumulation near Care Hospital junction. Drivers advised to divert via Road No. 10 or Masab Tank flyover.', 'HIGH', FALSE),
(8, 'MODERATE_RISK', 'Corporate Shift Dispersal Surge at Financial District', 'Heavy cluster of 4,000 shuttle buses entering Wipro circle between 18:30 and 19:30. Anticipate +15 min transit time.', 'MODERATE', FALSE),
(NULL, 'WEATHER_WARNING', 'Citywide Rain Alert: Pavement Wet & Reduced Friction', 'Ongoing 14.2 mm/h precipitation across Hyderabad IT Corridor. Average transit speeds depressed by 18-24%.', 'MODERATE', FALSE);
