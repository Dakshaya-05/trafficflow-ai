# TrafficFlow AI — AI-Based Traffic Prediction System
> **“Predict Traffic Problems Before They Happen”**  
> *Smarter predictions. Smoother journeys. Greener cities.*

[![Spring Boot 3.3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 21+](https://img.shields.io/badge/Java-21%20%7C%2025-orange.svg)](https://openjdk.org/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.13-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com/)
[![React 19 / Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Random%20Forest%20Classifier-yellow.svg)](https://scikit-learn.org/)
[![MySQL 8.0](https://img.shields.io/badge/Database-MySQL%208.0-00758F.svg)](https://www.mysql.com/)
[![JWT Security](https://img.shields.io/badge/Security-Spring%20Security%20%2B%20JWT-red.svg)](https://jwt.io/)

---

## ⚠️ Important Real-World Demonstration Disclaimer
> **This application uses a trained Random Forest model evaluated on an urban traffic dataset. Real-world traffic conditions depend on live sensor telemetries, municipal camera feeds, and real-time municipal integrations. Predictions should not be used as the sole basis for emergency dispatch or life-critical routing.**

---

## 1. Project Overview

TrafficFlow AI is a complete, deployment-ready full-stack web application designed to forecast and manage urban traffic congestion proactively. Rather than simply displaying past or current bumper-to-bumper delays, TrafficFlow AI analyzes vehicular parameters, environmental weather factors, and time cycles to classify congestion risks into:
- 🟢 **LOW TRAFFIC** (Green Indicator)
- 🟡 **MEDIUM TRAFFIC** (Yellow Indicator)
- 🔴 **HIGH TRAFFIC** (Red Indicator)

The system correlates location, vehicle counts, average vehicle speed, weather conditions, time of day, and road types to deliver actionable driver advisories and explainable contributing factors.

---

## 2. Key Architecture & Features

```
React Frontend (Vite, Tailwind, Recharts, Leaflet) : Port 5173
       │
       ▼  (REST API with Bearer JWT)
Spring Boot Backend (Java 21, Spring Security, JPA) : Port 8080
       │
       ├───────► MySQL 8.0 (`trafficflow` database) : Port 3306
       │
       └───────► Python AI Service (FastAPI, Scikit-learn Random Forest) : Port 8000
```

### Complete Feature List
1. **User Registration & Login**:
   - Secure BCrypt password hashing and JWT authentication.
   - Role-Based Access Control (`ROLE_USER`, `ROLE_ADMIN`).
   - Pre-seeded Demo Accounts for instant evaluation.
2. **AI Traffic Prediction Form**:
   - **Location**: Arterial corridors and junctions.
   - **Vehicle Count**: Observed vehicles per hour.
   - **Average Vehicle Speed**: Real-time transit velocity in km/h.
   - **Weather Condition**: Clear, Rainy, Foggy, Snowy, Overcast.
   - **Time of Day**: Morning Rush, Afternoon, Evening Rush, Night.
   - **Road Type**: Highway, Arterial, Urban, Residential.
3. **Three-Tier AI Classification**:
   - `LOW TRAFFIC`, `MEDIUM TRAFFIC`, `HIGH TRAFFIC`.
   - Distinct green, yellow, and red badges and pulsing indicators.
   - Model confidence percentage and 0–100 calculated Risk Index.
   - Actionable driver recommendations and contributing AI factors.
4. **Strict AI Reliability & Resilience**:
   - If the Python AI service is offline, Spring Boot returns a clean **HTTP 503 Service Unavailable** with an explicit error banner rather than presenting misleading synthetic fallback predictions.
5. **Traffic History with Search, Filter & Pagination**:
   - Search by location name.
   - Filter by risk level (Low, Medium, High).
   - Configurable pagination (5, 10, 20 rows per page).
   - View detailed AI advisory modal.
   - Delete records with confirmation.
6. **Analytics Dashboard with Recharts Visualizations**:
   - Summary cards: Total Records, Low / Medium / High counts, Average Speed, Total Vehicles.
   - Interactive Donut / Pie Chart for Traffic Level Distribution (Green #10B981, Yellow #F59E0B, Red #EF4444).
   - Corridor Speed vs Volume bar chart.
   - Congestion risk index area charts over time.
7. **System Administration Portal (`ROLE_ADMIN`)**:
   - Protected endpoint `/api/admin/**`.
   - User directory with role inspection.
   - User deletion with root admin protection.
   - Database health metrics.
8. **Interactive City Map & Live Telemetry**:
   - Leaflet GIS map with polyline color coding, incidents, and public events.
9. **Desktop 1-Click Quick-Start Shortcut**:
   - Pre-installed desktop icon `TrafficFlow AI.lnk` on Windows Desktop to launch all components simultaneously and open your browser.

---

## 3. Technology Stack

| Component | Technology | Version |
|---|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Recharts, Leaflet, Lucide React | React 19, Vite 8 |
| **Backend** | Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate, Maven | Java 21+, Spring Boot 3.3.4 |
| **Database** | MySQL Server (`trafficflow` database) | MySQL 8.0 |
| **Security** | Spring Security, JJWT (HMAC-SHA256), BCrypt | JJWT 0.12.6 |
| **AI / ML** | Python, FastAPI, Scikit-learn, Pandas, NumPy, Joblib | Python 3.11+, Scikit-learn 1.5+ |

---

## 4. Default Seeded Accounts

Upon first launch, `DataInitializer` seeds the following credentials into MySQL:

| Account | Username | Password | Role | Description |
|---|---|---|---|---|
| **System Admin** | `admin` | `admin123` | `ROLE_ADMIN` | Full administrative privileges, user management, and system stats |
| **Traffic Operator** | `traffic_officer` | `officer123` | `ROLE_USER` | Standard operator account for predictions and history review |

*(The frontend includes 1-click quick login buttons for both accounts.)*

---

## 5. Quick-Start (1-Click Desktop Icon)

A Windows desktop shortcut has been created on your desktop:
- **Shortcut Name**: `TrafficFlow AI.lnk`
- **Location**: `C:\Users\daksh\OneDrive\Desktop\TrafficFlow AI.lnk`

Double-clicking the shortcut performs the following sequence automatically:
1. Verifies the local MySQL 8.0 Windows service (`MySQL80`).
2. Starts the Python AI FastAPI service on `http://localhost:8000`.
3. Starts the Spring Boot backend on `http://localhost:8080`.
4. Starts the React Vite frontend on `http://localhost:5173`.
5. Opens your default web browser to `http://localhost:5173`.

---

## 6. Manual Setup & Execution Guide

### Prerequisites
- **Java**: JDK 21 or later installed (`java -version`).
- **Python**: Python 3.11 or later with pip (`python --version`).
- **Node.js**: Node 18+ with npm (`node -v`).
- **MySQL**: MySQL 8.0 running locally on port 3306 (`root` / `root`).

### Step 1: Database Setup
Make sure MySQL is running. In MySQL Workbench or command line:
```sql
CREATE DATABASE IF NOT EXISTS trafficflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```
*(The schema and baseline records are automatically seeded on Spring Boot startup by JPA Hibernate and `DataInitializer.java`).*

### Step 2: Start the Python AI Prediction Service
```powershell
cd "c:\Users\daksh\Downloads\New folder\trafficflow-ai\ai-service"

# Install dependencies if not already installed
pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Verify the AI service is live at: `http://localhost:8000/health`

### Step 3: Start the Spring Boot Backend
```powershell
cd "c:\Users\daksh\Downloads\New folder\trafficflow-ai\backend"

# Run with Maven Wrapper
.\mvnw.cmd spring-boot:run
```
The backend initializes on `http://localhost:8080`.

### Step 4: Start the React Frontend
```powershell
cd "c:\Users\daksh\Downloads\New folder\trafficflow-ai\frontend"

# Install dependencies if needed
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 7. REST API Reference

### Authentication Endpoints
- `POST /api/auth/register` — Register a new account (`username`, `email`, `password`, `fullName`, optional `role`). Returns JWT.
- `POST /api/auth/login` — Sign in (`username`, `password`). Returns JWT and user details.
- `GET /api/auth/me` — Inspect current authentication context.

### Traffic Prediction Endpoints
- `POST /api/traffic/predict` — [Protected] Evaluate traffic input parameters with Random Forest model and persist record to MySQL.
  - **Request Body**:
    ```json
    {
      "location": "Cyber Towers Junction",
      "vehicleCount": 1450,
      "averageSpeed": 21.0,
      "weatherCondition": "Rainy",
      "timeOfDay": "Evening Rush",
      "roadType": "Highway"
    }
    ```
  - **Response Body**:
    ```json
    {
      "id": 1,
      "location": "Cyber Towers Junction",
      "predictedTrafficLevel": "HIGH TRAFFIC",
      "confidence": 0.94,
      "riskScore": 88.5,
      "recommendation": "Severe congestion predicted. Deploy traffic wardens and redirect transit to Outer Ring Road.",
      "factors": ["Volume 65% above capacity", "Wet pavement friction loss", "Evening shift peak"],
      "createdAt": "2026-10-12T23:00:00"
    }
    ```
- `GET /api/traffic/history` — [Protected] Paginated traffic history with query parameters `search`, `level`, `page`, `size`, `sortBy`, `direction`.
- `GET /api/traffic/{id}` — [Protected] Retrieve single record by ID.
- `DELETE /api/traffic/{id}` — [Protected] Delete record by ID.
- `GET /api/dashboard/stats` — Aggregate metrics for KPI cards, distribution pie charts, and speed trends.

### Admin Endpoints (`hasRole('ROLE_ADMIN')`)
- `GET /api/admin/users` — List all registered user accounts.
- `DELETE /api/admin/users/{id}` — Remove a user account.
- `GET /api/admin/stats` — System-wide platform metrics.

---

## 8. Automated Testing

### Backend Tests (Spring Boot + MockMvc + JJWT)
```powershell
cd "c:\Users\daksh\Downloads\New folder\trafficflow-ai\backend"
.\mvnw.cmd test
```
*Result: 10/10 tests passed (0 failures, 0 errors).*

### AI Service Tests (Pytest)
```powershell
cd "c:\Users\daksh\Downloads\New folder\trafficflow-ai\ai-service"
python -m pytest tests/test_ml.py
```
*Result: 3/3 tests passed (0 failures).*

### Frontend Production Build (Vite)
```powershell
cd "c:\Users\daksh\Downloads\New folder\trafficflow-ai\frontend"
npm run build
```
*Result: Production bundle generated with zero errors.*

---

## 9. Production Deployment Guide

### Deploying Frontend to Vercel / Netlify
1. Set Build Command: `npm run build`
2. Set Output Directory: `dist`
3. Configure Environment Variable: `VITE_API_URL=https://your-backend-domain.com/api`

### Deploying Backend to Render / Railway / AWS EC2
1. Set Environment Variables:
   - `DB_URL=jdbc:mysql://<host>:3306/trafficflow?useSSL=true`
   - `DB_USERNAME=<mysql_user>`
   - `DB_PASSWORD=<mysql_password>`
   - `JWT_SECRET=<64_character_hex_secret>`
   - `AI_SERVICE_URL=https://your-ai-service.com`
2. Build Command: `./mvnw clean package -DskipTests`
3. Run Command: `java -jar target/trafficflow-backend-1.0.0.jar`

### Deploying Python AI Service to Render / Railway / Google Cloud Run
1. Dockerfile or buildpack command:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

---

## 10. License & Credits

Built as a high-performance demonstration of AI-driven intelligent transportation systems.  
© 2026 TrafficFlow AI. All rights reserved.
