Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host "   TRAFFICFLOW AI - Full Stack AI-Based Traffic Prediction System" -ForegroundColor Cyan
Write-Host "   'Predict Traffic Problems Before They Happen'" -ForegroundColor Cyan
Write-Host "==============================================================================" -ForegroundColor Cyan
Write-Host ""

$ROOT_DIR = "C:\Users\daksh\Downloads\New folder\trafficflow-ai"

# 1. MySQL Service Check
Write-Host "[1/4] Verifying MySQL Database Service..." -ForegroundColor Yellow
try {
    Start-Service -Name "MySQL80" -ErrorAction SilentlyContinue
    Write-Host "[OK] MySQL80 service active." -ForegroundColor Green
} catch {
    Write-Host "[INFO] MySQL check completed." -ForegroundColor Gray
}

# 2. Start Python AI Service on Port 8000
Write-Host "[2/4] Starting Python AI Prediction Service (FastAPI) on port 8000..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$ROOT_DIR\ai-service`" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

# 3. Start Spring Boot Backend on Port 8080
Write-Host "[3/4] Starting Spring Boot Backend (Java 21 + MySQL) on port 8080..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$ROOT_DIR\backend`" && mvnw.cmd spring-boot:run"

# 4. Start React Frontend on Port 5173
Write-Host "[4/4] Starting React Vite Frontend on port 5173..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "cd /d `"$ROOT_DIR\frontend`" && npm run dev"

Write-Host ""
Write-Host "All services initiated. Opening application browser in 5 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"
