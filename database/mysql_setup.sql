-- ==============================================================================
-- TrafficFlow AI - MySQL Database Setup Script
-- Database: trafficflow
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS trafficflow
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE trafficflow;

-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER', -- ROLE_USER or ROLE_ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Traffic Records table (User input data & AI predictions)
CREATE TABLE IF NOT EXISTS traffic_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(150) NOT NULL,
    vehicle_count INT NOT NULL,
    average_speed DOUBLE NOT NULL,
    weather_condition VARCHAR(50) NOT NULL, -- Clear, Rainy, Foggy, Snowy, Overcast
    time_of_day VARCHAR(50) NOT NULL,       -- Morning Rush, Afternoon, Evening Rush, Night
    road_type VARCHAR(50) NOT NULL,         -- Highway, Arterial, Urban, Residential
    predicted_traffic_level VARCHAR(30) NOT NULL, -- LOW TRAFFIC, MEDIUM TRAFFIC, HIGH TRAFFIC
    confidence DOUBLE NOT NULL,
    risk_score DOUBLE NOT NULL,
    recommendation TEXT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert Default Admin User (Password is 'admin123' hashed with BCrypt)
-- Hash: $2a$10$w3.X94d1R2K5MvO80zZzre6NfD91VfPq12Zg5Q7p3S4h.m.Cg5zKy
INSERT INTO users (username, email, password, full_name, role)
SELECT 'admin', 'admin@trafficflow.ai', '$2a$10$WpZ7R8mUeN9lK7m.pY6QweaW8rBw3kG0Z6l8uD8h2Jk4n6F8x1L2.', 'System Administrator', 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Insert Initial Sample Traffic Records
INSERT INTO traffic_records (location, vehicle_count, average_speed, weather_condition, time_of_day, road_type, predicted_traffic_level, confidence, risk_score, recommendation)
VALUES 
('Cyber Towers Junction', 1250, 18.5, 'Rainy', 'Evening Rush', 'Highway', 'HIGH TRAFFIC', 0.94, 88.0, 'Major delays expected. Divert via ORR West.'),
('Financial District Ring Road', 820, 42.0, 'Clear', 'Morning Rush', 'Arterial', 'MEDIUM TRAFFIC', 0.88, 52.0, 'Moderate flow. Maintain safe vehicle distance.'),
('Outer Ring Road Exit 14', 380, 78.0, 'Clear', 'Afternoon', 'Highway', 'LOW TRAFFIC', 0.96, 18.0, 'Optimal transit speed with no anticipated delays.'),
('Banjara Hills Road 12', 1100, 22.0, 'Rainy', 'Evening Rush', 'Urban', 'HIGH TRAFFIC', 0.91, 84.0, 'Severe congestion forming near commercial district.'),
('Airport Expressway PVNR', 540, 65.0, 'Clear', 'Night', 'Highway', 'LOW TRAFFIC', 0.95, 22.0, 'Free flowing corridor towards Shamshabad.');
