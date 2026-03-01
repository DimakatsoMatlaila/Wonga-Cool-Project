# Backend API

Enterprise-grade C# .NET 8 API following Clean Architecture principles.

## Architecture

This backend follows the **Clean Architecture** pattern with four distinct layers:

### 1. Domain Layer (`UserAuth.Domain`)
- **Purpose**: Core business entities and domain logic
- **Dependencies**: None (pure domain logic)
- **Contents**:
  - Entities (User, RefreshToken)
  - Repository interfaces
  - Domain exceptions
  - Value objects

### 2. Application Layer (`UserAuth.Application`)
- **Purpose**: Business logic and orchestration
- **Dependencies**: Domain layer only
- **Contents**:
  - DTOs (Data Transfer Objects)
  - Service interfaces and implementations
  - Validators (FluentValidation)
  - AutoMapper profiles
  - Custom exceptions

### 3. Infrastructure Layer (`UserAuth.Infrastructure`)
- **Purpose**: External concerns (database, external APIs)
- **Dependencies**: Application and Domain layers
- **Contents**:
  - DbContext and EF Core configurations
  - Repository implementations
  - Token service
  - Database migrations

### 4. API Layer (`UserAuth.API`)
- **Purpose**: HTTP endpoints and presentation
- **Dependencies**: All other layers
- **Contents**:
  - Controllers
  - Middleware
  - Configuration
  - Program.cs (entry point)

## Technologies

- **.NET 8**: Latest LTS version
- **Entity Framework Core 8**: ORM with PostgreSQL provider
- **JWT Bearer**: Token-based authentication
- **FluentValidation**: Request validation
- **AutoMapper**: Object-to-object mapping
- **Serilog**: Structured logging
- **Swagger/OpenAPI**: API documentation
- **xUnit**: Unit testing framework
- **Moq**: Mocking framework
- **Testcontainers**: Integration testing with real PostgreSQL

## Dependencies Installation

All dependencies are managed via NuGet packages. Run:

```bash
dotnet restore
```

### Key NuGet Packages

**API Project**:
- Microsoft.AspNetCore.Authentication.JwtBearer (8.0.2)
- Swashbuckle.AspNetCore (6.5.0)
- Serilog.AspNetCore (8.0.1)

**Application Project**:
- AutoMapper.Extensions.Microsoft.DependencyInjection (12.0.1)
- FluentValidation.AspNetCore (11.3.0)
- MediatR (12.2.0)

**Infrastructure Project**:
- Microsoft.EntityFrameworkCore (8.0.2)
- Npgsql.EntityFrameworkCore.PostgreSQL (8.0.2)
- BCrypt.Net-Next (4.0.3)

**Testing Projects**:
- xUnit (2.6.6)
- Moq (4.20.70)
- FluentAssertions (6.12.0)
- Testcontainers.PostgreSql (3.7.0)
- Microsoft.AspNetCore.Mvc.Testing (8.0.2)

## Running Locally

1. **Prerequisites**:
   - .NET 8 SDK
   - PostgreSQL 15+ (or use Docker)

2. **Database Setup**:
   ```bash
   # Start PostgreSQL with Docker
   docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15-alpine
   ```

3. **Update Connection String**:
   
   Edit `src/UserAuth.API/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=userauth;Username=postgres;Password=postgres"
     }
   }
   ```

4. **Run Migrations**:
   ```bash
   dotnet ef database update --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API
   ```

5. **Run the API**:
   ```bash
   cd src/UserAuth.API
   dotnet run
   ```

   API will be available at:
   - HTTP: http://localhost:5000
   - Swagger: http://localhost:5000/swagger

## Testing

### Unit Tests
```bash
dotnet test tests/UserAuth.Tests.Unit --verbosity normal
```

### Integration Tests
```bash
dotnet test tests/UserAuth.Tests.Integration --verbosity normal
```

### All Tests
```bash
dotnet test --verbosity normal
```

### Code Coverage

**Quick Coverage (Console Output)**:
```bash
dotnet test --collect:"XPlat Code Coverage"
```

**HTML Coverage Report**:
```bash
# Install ReportGenerator (one-time)
dotnet tool install -g dotnet-reportgenerator-globaltool

# Run tests with coverage and generate HTML report
dotnet test --collect:"XPlat Code Coverage" --results-directory ./TestResults
reportgenerator -reports:"./TestResults/**/coverage.cobertura.xml" -targetdir:"./CoverageReport" -reporttypes:Html

# Open the report
start ./CoverageReport/index.html
```

**Or use the coverage script**:
```bash
./coverage.bat  # Windows
```

## Database Migrations

### Add a new migration
```bash
dotnet ef migrations add MigrationName --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API
```

### Update database
```bash
dotnet ef database update --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API
```

### Remove last migration
```bash
dotnet ef migrations remove --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API
```

## API Endpoints

### Health Check
```
GET /health
```

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me (Requires authentication)
```

For detailed API documentation, access `/swagger` when the API is running.

## Configuration

Key settings in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=postgres;Port=5432;Database=userauth;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "SecretKey": "Your-Secret-Key-Here",
    "Issuer": "UserAuthAPI",
    "Audience": "UserAuthClient"
  }
}
```

## Security Considerations

- **Password Hashing**: BCrypt with salt
- **JWT Tokens**: HS256 algorithm with configurable expiry
- **CORS**: Configured for specific origins
- **HTTPS**: Enforced in production
- **Input Validation**: FluentValidation on all endpoints
- **SQL Injection**: Protected via EF Core parameterized queries

## Performance Optimizations

- Async/await throughout
- Database query optimization with AsNoTracking
- Connection pooling via Npgsql
- Efficient DTOs to reduce data transfer
- Caching strategies for frequently accessed data

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `docker ps`
- Check connection string in `appsettings.json`
- Ensure database exists: `docker exec -it postgres psql -U postgres -l`

### Migration Issues
- Delete database and recreate: `dotnet ef database drop`
- Remove all migrations and start fresh
- Check for pending migrations: `dotnet ef migrations list`

### Build Errors
- Clean solution: `dotnet clean`
- Restore packages: `dotnet restore`
- Rebuild: `dotnet build`
