$ErrorActionPreference = "Stop"
$PORT = 3000
$MAX_RETRIES = 60
$RETRY_DELAY = 1000
$STARTUP_TIMEOUT = 120000

function Get-PortStatus {
    param([int]$Port)
    $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $conn -ne $null
}

function Remove-PortProcess {
    param([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        $uniquePids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pid in $uniquePids) {
            $name = (Get-Process -Id $pid -ErrorAction SilentlyContinue).ProcessName
            Write-Host "[CLEANUP] Terminating PID $pid ($name) on port $Port"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Milliseconds 500
    }
}

Write-Host "=== Next.js Port 3000 Startup Guard ===" -ForegroundColor Cyan

Write-Host "[1/4] Checking port $PORT status..." -ForegroundColor Yellow
if (Get-PortStatus -Port $PORT) {
    Write-Host "    Port $PORT is OCCUPIED - cleaning up..." -ForegroundColor Yellow
    Remove-PortProcess -Port $PORT
    Write-Host "    Port $PORT freed." -ForegroundColor Green
} else {
    Write-Host "    Port $PORT is FREE." -ForegroundColor Green
}

Write-Host "[2/4] Starting Next.js dev server on port $PORT..." -ForegroundColor Yellow
$startTime = Get-Date
$serverReady = $false

$job = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    & cmd /c "npm run dev"
} -ArgumentList (Get-Location)

Write-Host "[3/4] Waiting for server readiness (max ${STARTUP_TIMEOUT}ms)..." -ForegroundColor Yellow
while (((Get-Date) - $startTime).TotalMilliseconds -lt $STARTUP_TIMEOUT) {
    if (Get-PortStatus -Port $PORT) {
        Write-Host "    Port $PORT is LISTENING at $(((Get-Date) - $startTime).TotalSeconds)s" -ForegroundColor Green
        
        Write-Host "[4/4] Verifying HTTP response..." -ForegroundColor Yellow
        for ($i = 0; $i -lt $MAX_RETRIES; $i++) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:$PORT" -Method Head -TimeoutSec 3 -ErrorAction SilentlyContinue
                if ($response.StatusCode -in 200, 304, 307, 308) {
                    Write-Host "    Server responding (HTTP $($response.StatusCode))" -ForegroundColor Green
                    $serverReady = $true
                    break
                }
            } catch {
                Write-Host "    Waiting for response... ($i/$MAX_RETRIES)" -ForegroundColor Gray
            }
            Start-Sleep -Milliseconds $RETRY_DELAY
        }
        break
    }
    Start-Sleep -Milliseconds 300
}

if (-not $serverReady) {
    Write-Host "[ERROR] Server failed to start within ${STARTUP_TIMEOUT}ms" -ForegroundColor Red
    Stop-Job -Job $job -ErrorAction SilentlyContinue
    Remove-Job -Job $job -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""
Write-Host "=== SUCCESS: http://localhost:$PORT is ready ===" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray

$global:devJob = $job
try {
    while ($job.State -eq "Running") {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Shutting down..." -ForegroundColor Yellow
    Stop-Job -Job $job -ErrorAction SilentlyContinue
    Remove-Job -Job $job -ErrorAction SilentlyContinue
    Remove-PortProcess -Port $PORT
}