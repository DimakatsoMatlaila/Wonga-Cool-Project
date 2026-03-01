@echo off
echo Running tests with coverage...
dotnet test --collect:"XPlat Code Coverage" --results-directory ./TestResults

echo.
echo Generating HTML coverage report...
reportgenerator -reports:"./TestResults/**/coverage.cobertura.xml" -targetdir:"./CoverageReport" -reporttypes:Html

echo.
echo Coverage report generated at: ./CoverageReport/index.html
echo Opening report...
start ./CoverageReport/index.html
