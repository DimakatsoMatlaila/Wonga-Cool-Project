#!/bin/bash

# Build script for the entire application
# This script builds both backend and frontend, runs tests, and creates Docker images

set -e  # Exit on error

echo "================================"
echo "Building User Auth Application"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
fi

print_status "Docker found"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed"
    exit 1
fi

print_status "Docker Compose found"

# Backend Build
echo ""
print_info "Building Backend..."
cd backend

# Restore dependencies
print_info "Restoring .NET dependencies..."
dotnet restore
print_status "Dependencies restored"

# Build solution
print_info "Building .NET solution..."
dotnet build --configuration Release --no-restore
print_status "Backend build completed"

# Run tests
print_info "Running backend tests..."
dotnet test --configuration Release --no-build --verbosity normal
print_status "Backend tests passed"

cd ..

# Frontend Build
echo ""
print_info "Building Frontend..."
cd frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_info "Installing npm dependencies..."
    npm install
    print_status "Dependencies installed"
else
    print_info "Skipping npm install (node_modules exists)"
fi

# Run linting
print_info "Running linter..."
npm run lint
print_status "Linting passed"

# Build frontend
print_info "Building React app..."
npm run build
print_status "Frontend build completed"

cd ..

# Docker Build
echo ""
print_info "Building Docker images..."

# Build images without cache for clean build
docker-compose build --no-cache

print_status "Docker images built successfully"

# Summary
echo ""
echo "================================"
echo "Build Summary"
echo "================================"
print_status "Backend built and tested"
print_status "Frontend built and linted"
print_status "Docker images created"
echo ""
print_info "Run 'docker-compose up' to start the application"
echo "================================"
