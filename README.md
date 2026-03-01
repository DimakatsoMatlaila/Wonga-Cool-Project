# User Authentication Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)

An enterprise-grade user authentication API built with C# (.NET 8), PostgreSQL, and Docker. This application demonstrates modern software architecture patterns, comprehensive testing, and best practices.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### User Features
- **User Registration**: Create new accounts with email and password
- **User Login**: Authenticate with email and password
- **User Details**: View personal profile information (authenticated users only)
- **Protected Routes**: Access control for authenticated users
- **JWT Authentication**: Secure token-based authentication

### Technical Features
- **Clean Architecture**: Separation of concerns with Domain, Application, Infrastructure, and API layers
- **Repository Pattern**: Abstraction of data access logic
- **Unit of Work**: Transaction management
- **Dependency Injection**: Loose coupling and testability
- **Validation**: FluentValidation for request validation
- **Error Handling**: Global exception handling middleware
- **Logging**: Structured logging with Serilog
- **Health Checks**: API health monitoring
- **Automated Tests**: Comprehensive unit and integration tests
- **CI/CD**: GitHub Actions workflows
- **Docker**: Containerized application and database
- **API Documentation**: Swagger/OpenAPI

## 🏗️ Architecture

This application follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           API Layer (Presentation)       │
│   Controllers, Middleware, Swagger      │
├─────────────────────────────────────────┤
│        Application Layer (Business)      │
│   Services, DTOs, Validators, Mapping   │
├─────────────────────────────────────────┤
│      Infrastructure Layer (Data)         │
│  DbContext, Repositories, External APIs  │
├─────────────────────────────────────────┤
│          Domain Layer (Core)             │
│     Entities, Interfaces, Exceptions     │
└─────────────────────────────────────────┘
```

### Design Patterns Used
- **Repository Pattern**: Data access abstraction
- **Unit of Work**: Transaction management
- **Dependency Injection**: Inversion of control
- **Factory Pattern**: Object creation
- **Strategy Pattern**: JWT token generation
- **Middleware Pattern**: Request/response pipeline

## 🛠️ Technology Stack

### Backend
- **Framework**: .NET 8 / C# 12
- **ORM**: Entity Framework Core 8
- **Database**: PostgreSQL 15
- **Authentication**: JWT Bearer Tokens
- **Validation**: FluentValidation
- **Mapping**: AutoMapper
- **Logging**: Serilog
- **Testing**: xUnit, Moq, FluentAssertions, Testcontainers

### DevOps
- **Containerization**: Docker & Docker Compose
- **Code Quality**: .NET Analyzers
- **Version Control**: Git

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop**: [Download](https://docs.docker.com/get-docker/)
- **Docker Compose**: Included with Docker Desktop
- **.NET 8 SDK**: [Download](https://dotnet.microsoft.com/download) (for local development)
- **Git**: [Download](https://git-scm.com/downloads)

### Optional (for development)
- **Visual Studio 2022** or **VS Code**
- **Postman** or **Insomnia** (for API testing)
- **pgAdmin** or **DBeaver** (for database management)

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the values (especially passwords and JWT secret):
   ```env
   POSTGRES_PASSWORD=your_secure_password
   JWT_SECRET_KEY=your_very_secure_jwt_secret_key_at_least_32_characters
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/swagger
   - Health Check: http://localhost:5000/health

5. **Stop the application**
   ```bash
   docker-compose down
   ```

   To remove volumes (database data):
   ```bash
   docker-compose down -v
   ```

## 🏃 Running the Application

### Option 1: Docker Compose (Recommended)

See [Quick Start](#quick-start) above.

### Option 2: Local Development

#### Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Update database connection string**
   
   Edit `src/UserAuth.API/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=userauth;Username=postgres;Password=postgres"
     }
   }
   ```

4. **Run database migrations**
   ```bash
   dotnet ef database update --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API
   ```

5. **Run the API**
   ```bash
   cd src/UserAuth.API
   dotnet run
   ```

   The API will be available at http://localhost:5000

## 🧪 Testing

### Backend Tests

#### Run all tests
```bash
cd backend
dotnet test
```

#### Run unit tests only
```bash
dotnet test tests/UserAuth.Tests.Unit
```

#### Run integration tests only
```bash
dotnet test tests/UserAuth.Tests.Integration
```

#### Run with coverage
```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Endpoints

#### Authentication

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "kJ56gH89jK...",
  "expiresAt": "2024-03-01T12:00:00Z",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-03-01T11:00:00Z"
  }
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "Password123!"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "kJ56gH89jK...",
  "expiresAt": "2024-03-01T12:00:00Z",
  "user": { ... }
}
```

**Get Current User**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response: 200 OK
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-03-01T11:00:00Z"
}
```

For complete API documentation, visit http://localhost:5000/swagger when running the application.

## 📁 Project Structure

```
.
├── backend/                      # Backend C# application
│   ├── src/
│   │   ├── UserAuth.Domain/      # Domain entities and interfaces
│   │   ├── UserAuth.Application/ # Business logic and DTOs
│   │   ├── UserAuth.Infrastructure/ # Data access and external services
│   │   └── UserAuth.API/         # API controllers and configuration
│   ├── tests/
│   │   ├── UserAuth.Tests.Unit/  # Unit tests
│   │   └── UserAuth.Tests.Integration/ # Integration tests
│   ├── Dockerfile
│   └── UserAuth.sln
├── docker-compose.yml            # Development Docker Compose
├── docker-compose.prod.yml       # Production Docker Compose
├── .env.example                  # Environment variables template
└── README.md
```

## 💻 Development

### Backend Development

#### Add a new migration
```bash
cd backend
dotnet ef migrations add MigrationName --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API
```

#### Update database
```bash
dotnet ef database update --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API
```

#### Run code formatting
```bash
dotnet format
```

## 🚢 Deployment

### Production Deployment with Docker

1. **Build images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Start services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Clean Architecture pattern by Robert C. Martin
- Entity Framework Core documentation
- Docker documentation

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built by Dimakatso Matlaila
