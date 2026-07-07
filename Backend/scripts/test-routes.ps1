$base = "http://localhost:5000"
$pass = 0
$fail = 0

function Test-Get {
    param($path)
    try {
        $r = Invoke-WebRequest -Uri "$base$path" -ErrorAction Stop -TimeoutSec 10
        Write-Host "[PASS] $($r.StatusCode) GET $path" -ForegroundColor Green
        $script:pass++
    } catch {
        $sc = $_.Exception.Response.StatusCode.value__
        Write-Host "[FAIL] $sc GET $path" -ForegroundColor Red
        $script:fail++
    }
}

function Test-Post {
    param($path, $body)
    try {
        $json = $body | ConvertTo-Json
        $r = Invoke-WebRequest -Uri "$base$path" -Method POST -Body $json -ContentType "application/json" -ErrorAction Stop -TimeoutSec 10
        Write-Host "[PASS] $($r.StatusCode) POST $path" -ForegroundColor Green
        $script:pass++
        return $r.Content | ConvertFrom-Json
    } catch {
        $sc = $_.Exception.Response.StatusCode.value__
        Write-Host "[FAIL] $sc POST $path" -ForegroundColor Red
        $script:fail++
        return $null
    }
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  EARTHQUAKE API - ROUTE VERIFICATION" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Root
Test-Get "/"

# Health
Test-Get "/earthquakes/system/health"

# Core earthquake routes
Test-Get "/earthquakes"
Test-Get "/earthquakes/high-magnitude"
Test-Get "/earthquakes/deep"
Test-Get "/earthquakes/shallow"
Test-Get "/earthquakes/recent"
Test-Get "/earthquakes/reviewed"
Test-Get "/earthquakes/critical"
Test-Get "/earthquakes/high-gap"
Test-Get "/earthquakes/high-rms"
Test-Get "/earthquakes/oceanic"
Test-Get "/earthquakes/random"

# Sort routes
Test-Get "/earthquakes/sort/magnitude-desc"
Test-Get "/earthquakes/sort/time-desc"

# Filter routes
Test-Get "/earthquakes/filter/high-magnitude"
Test-Get "/earthquakes/filter/deep"
Test-Get "/earthquakes/filter/shallow"
Test-Get "/earthquakes/filter/reviewed"
Test-Get "/earthquakes/filter/critical"

# Param routes
Test-Get "/earthquakes/place/Japan"
Test-Get "/earthquakes/country/Japan"
Test-Get "/earthquakes/type/earthquake"
Test-Get "/earthquakes/status/reviewed"
Test-Get "/earthquakes/mag-type/mb"
Test-Get "/earthquakes/network/us"
Test-Get "/earthquakes/year/2015"
Test-Get "/earthquakes/month/6"
Test-Get "/earthquakes/magnitude/5.5"
Test-Get "/earthquakes/depth/100"

# Error handling tests (expect 4xx)
Test-Get "/earthquakes/status/invalid"
Test-Get "/earthquakes/magnitude/abc"
Test-Get "/earthquakes/depth/invalid"
Test-Get "/earthquakes/nonexistent-xyz"
Test-Get "/nonexistent-route"

# Search
Test-Get "/search/earthquakes?q=japan"
Test-Get "/search/earthquakes?q=reviewed"
Test-Get "/search/earthquakes?q=deep"

# Analytics
Test-Get "/analytics/earthquakes/highest-magnitude"
Test-Get "/analytics/earthquakes/deepest"
Test-Get "/analytics/earthquakes/recent-activity"
Test-Get "/analytics/earthquakes/country-analysis"
Test-Get "/analytics/earthquakes/network-analysis"
Test-Get "/analytics/earthquakes/magnitude-analysis"
Test-Get "/analytics/earthquakes/depth-analysis"
Test-Get "/analytics/earthquakes/error-analysis"
Test-Get "/analytics/earthquakes/monthly-analysis"

# Stats
Test-Get "/stats/earthquakes/count"
Test-Get "/stats/earthquakes/highest-magnitude"
Test-Get "/stats/earthquakes/deepest"
Test-Get "/stats/earthquakes/average-depth"
Test-Get "/stats/earthquakes/average-magnitude"
Test-Get "/stats/earthquakes/country-count"
Test-Get "/stats/earthquakes/type-count"
Test-Get "/stats/earthquakes/network-count"
Test-Get "/stats/earthquakes/reviewed-count"
Test-Get "/stats/earthquakes/monthly-count"

# Middleware routes
Test-Get "/middleware/logger"
Test-Get "/middleware/auth"
Test-Get "/middleware/rate-limit"
Test-Get "/middleware/request-time"
Test-Get "/middleware/cache"

# Auth - register
$regResult = Test-Post "/auth/register" @{ name = "Arpan Shah"; email = "arpan@example.com"; password = "Password123" }
$token = $null
if ($regResult -and $regResult.data) {
    $token = $regResult.data.accessToken
}

# Auth - login
$loginResult = Test-Post "/auth/login" @{ email = "arpan@example.com"; password = "Password123" }
if ($loginResult -and $loginResult.data) {
    $token = $loginResult.data.accessToken
    Write-Host "  -> Token obtained: $($token.Substring(0,30))..." -ForegroundColor Yellow
}

# Protected routes with token
if ($token) {
    try {
        $r = Invoke-WebRequest -Uri "$base/auth/profile" -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
        Write-Host "[PASS] $($r.StatusCode) GET /auth/profile (with token)" -ForegroundColor Green
        $pass++
    } catch {
        Write-Host "[FAIL] $($_.Exception.Response.StatusCode.value__) GET /auth/profile" -ForegroundColor Red
        $fail++
    }

    try {
        $r = Invoke-WebRequest -Uri "$base/jwt/profile" -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
        Write-Host "[PASS] $($r.StatusCode) GET /jwt/profile (with token)" -ForegroundColor Green
        $pass++
    } catch {
        Write-Host "[FAIL] $($_.Exception.Response.StatusCode.value__) GET /jwt/profile" -ForegroundColor Red
        $fail++
    }

    try {
        $r = Invoke-WebRequest -Uri "$base/jwt/dashboard" -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop
        Write-Host "[PASS] $($r.StatusCode) GET /jwt/dashboard (with token)" -ForegroundColor Green
        $pass++
    } catch {
        Write-Host "[FAIL] $($_.Exception.Response.StatusCode.value__) GET /jwt/dashboard" -ForegroundColor Red
        $fail++
    }
}

# Expect 401 on protected routes without token
try {
    Invoke-WebRequest -Uri "$base/auth/profile" -ErrorAction Stop | Out-Null
    Write-Host "[FAIL] Should have returned 401 for /auth/profile without token" -ForegroundColor Red
    $fail++
} catch {
    $sc = $_.Exception.Response.StatusCode.value__
    if ($sc -eq 401) {
        Write-Host "[PASS] 401 GET /auth/profile (no token - correct)" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "[FAIL] $sc GET /auth/profile (expected 401)" -ForegroundColor Red
        $fail++
    }
}

# Expect 403 on admin route with non-admin token
if ($token) {
    try {
        Invoke-WebRequest -Uri "$base/admin/earthquakes" -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop | Out-Null
        Write-Host "[FAIL] Should have returned 403 for /admin/earthquakes (non-admin)" -ForegroundColor Red
        $fail++
    } catch {
        $sc = $_.Exception.Response.StatusCode.value__
        if ($sc -eq 403) {
            Write-Host "[PASS] 403 GET /admin/earthquakes (non-admin - correct)" -ForegroundColor Green
            $pass++
        } else {
            Write-Host "[FAIL] $sc GET /admin/earthquakes (expected 403)" -ForegroundColor Red
            $fail++
        }
    }
}

# JWT token operations
$jwtResult = Test-Post "/jwt/generate-token" @{ userId = "507f1f77bcf86cd799439011" }
$testToken = if ($jwtResult -and $jwtResult.data) { $jwtResult.data.accessToken } else { "bad-token" }
Test-Post "/jwt/verify-token" @{ token = $testToken }

# Pagination + combinations
Test-Get "/earthquakes?page=1&limit=5&sort=magnitude"
Test-Get "/earthquakes?country=Japan&sort=magnitude"
Test-Get "/earthquakes?minMagnitude=5.0&sort=magnitude"
Test-Get "/earthquakes?status=reviewed&sort=time"

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "  RESULTS: PASS=$pass  FAIL=$fail  TOTAL=$($pass+$fail)" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan
