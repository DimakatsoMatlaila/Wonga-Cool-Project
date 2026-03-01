@echo off
REM Build script for Windows
REM This script builds both backend and frontend, runs tests, and creates Docker images

echo ================================
echo Building User Auth Application
echo ================================

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not installed
    exit /b 1
)
echo [OK] Docker found

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker Compose is not installed
    exit /b 1
)
echo [OK] Docker Compose found

REM Backend Build
echo.
echo Building Backend...
cd backend

echo Restoring .NET dependencies...
dotnet restore
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to restore dependencies
    exit /b 1
)
echo [OK] Dependencies restored

echo Building .NET solution...
dotnet build --configuration Release --no-restore
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    exit /b 1
)
echo [OK] Backend build completed

echo Running backend tests...
dotnet test --configuration Release --no-build --verbosity normal
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Tests failed
    exit /b 1
)
echo [OK] Backend tests passed

cd ..

REM Frontend Build
echo.
echo Building Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [INFO] Skipping npm install node_modules exists
)

echo Running linter...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Linting failed
    exit /b 1
)
echo [OK] Linting passed

echo Building React app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend build failed
    exit /b 1
)
echo [OK] Frontend build completed

cd ..

REM Docker Build
echo.
echo Building Docker images...
docker-compose build --no-cache
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker build failed
    exit /b 1
)
echo [OK] Docker images built successfully

REM Summary
echo.
echo ================================
echo Build Summary
echo ================================
echo [OK] Backend built and tested
echo [OK] Frontend built and linted
echo [OK] Docker images created
echo.
echo [INFO] Run 'docker-compose up' to start the application
echo ================================
