# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all source code
COPY src/ ./src/

# Build and restore in one step
WORKDIR /src/src/UserAuth.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

# Copy published app
COPY --from=build /app/publish .

# Set entry point
ENTRYPOINT ["dotnet", "UserAuth.API.dll"]
