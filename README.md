# User Authentication Application

[![codecov](https://codecov.io/gh/DimakatsoMatlaila/Wonga-Cool-Project/graph/badge.svg?token=WZY01YJ0LJ)](https://codecov.io/gh/DimakatsoMatlaila/Wonga-Cool-Project)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET](https://img.shields.io/badge/.NET-8.0-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)



A full-stack user authentication application built with React, TypeScript, C# (.NET 8), PostgreSQL, and Docker. This application demonstrates modern software architecture patterns, comprehensive testing, and best practices.

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
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### User Features
- **User Registration**: Create new accounts with email and password via a modern registration form
- **User Login**: Authenticate with email and password through an intuitive login interface
- **User Profile**: View personal profile information including name, email, and account details
- **Protected Routes**: Access control for authenticated users with automatic redirects
- **JWT Authentication**: Secure token-based authentication with automatic token management
- **Corporate Design**: Professional Wonga Finance white and light blue theme
- **Form Validation**: Client-side and server-side validation with helpful error messages
- **Password Security**: Strong password requirements enforced

### Technical Features
- **Clean Architecture**: Separation of concerns with Domain, Application, Infrastructure, and API layers
- **Repository Pattern**: Abstraction of data access logic
- **Unit of Work**: Transaction management
- **Dependency Injection**: Loose coupling and testability
- **Validation**: FluentValidation for request validation
- **Error Handling**: Global exception handling middleware
- **Logging**: Structured logging with Serilog
- **Health Checks**: API health monitoring
- **Automated Tests**: Comprehensive unit and integration tests for both frontend and backend
- **Responsive Design**: Mobile-friendly user interface
- **Corporate Branding**: Consistent Wonga Finance visual identity
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

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite
- **Routing**: React Router 6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Testing**: Vitest, React Testing Library

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
- **Web Server**: Nginx (frontend)
- **Code Quality**: ESLint, .NET Analyzers
- **Version Control**: Git

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop**: [Download](https://docs.docker.com/get-docker/)
- **Docker Compose**: Included with Docker Desktop
- **.NET 8 SDK**: [Download](https://dotnet.microsoft.com/download) (for local development)
- **Node.js 20+**: [Download](https://nodejs.org/) (for local frontend development)
- **Git**: [Download](https://git-scm.com/downloads)

### Optional (for development)
- **Visual Studio 2022** or **VS Code**
- **Postman** or **Insomnia** (for API testing)
- **pgAdmin** or **DBeaver** (for database management)

## 🚀 Quick Start

### Option A: Docker Compose (Recommended - Full Stack)

Run the entire application stack (frontend + backend + database) with a single command.

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Wonga.git
   cd Wonga
   ```

2. **Create environment file** (optional)
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to customize (defaults work out of the box):
   ```env
   POSTGRES_PASSWORD=postgres
   JWT_SECRET_KEY=ThisIsAVerySecretKeyForJWTTokenGenerationWithAtLeast32Characters!
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```
   
   This will start:
   - ✅ PostgreSQL database (port 5432)
   - ✅ Backend API (port 5000)
   - ✅ Frontend app (port 3000)

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **API Docs (Swagger)**: http://localhost:5000/swagger
   - **Health Check**: http://localhost:5000/health

5. **View logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f frontend
   docker-compose logs -f backend
   ```

6. **Stop the application**
   ```bash
   docker-compose down
   ```

   To remove data volumes:
   ```bash
   docker-compose down -v
   ```

### Option B: Local Development (No Docker)

Run frontend and backend separately for active development with hot-reload.

#### Prerequisites
- .NET 8 SDK
- Node.js 20+
- PostgreSQL 15+ (install locally or use Docker for DB only)

#### Step 1: Start PostgreSQL

**Option 1: Docker (database only)**
```bash
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=userauth \
  -p 5432:5432 \
  postgres:15-alpine
```

**Option 2: Local PostgreSQL**
- Install PostgreSQL and create a database named `userauth`

#### Step 2: Start Backend

```bash
cd backend

# Restore dependencies
dotnet restore

# Run database migrations
dotnet ef database update --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API

# Start the API (with hot-reload)
cd src/UserAuth.API
dotnet watch run
```

✅ Backend running at: **http://localhost:5000**  
✅ Swagger UI at: **http://localhost:5000/swagger**

#### Step 3: Start Frontend

Open a **new terminal**:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server (with hot-reload)
npm run dev
```

✅ Frontend running at: **http://localhost:3000**  
✅ Hot-reload enabled for both frontend and backend

#### Step 4: Develop!

- Frontend changes auto-reload at http://localhost:3000
- Backend changes auto-reload via `dotnet watch`
- Database persists between restarts

## 🏃 Running the Application

This section provides detailed instructions for different deployment scenarios.

### Development Workflow Comparison

| Feature | Docker Compose | Local Development |
|---------|----------------|-------------------|
| **Setup Time** | ⚡ Fast (1 command) | ⏱️ Moderate (multiple steps) |
| **Hot Reload** | ❌ No | ✅ Yes (both frontend & backend) |
| **Dependencies** | Docker only | .NET SDK + Node.js + PostgreSQL |
| **Use Case** | Testing full stack | Active development |
| **Database** | Isolated container | Shared local instance |

### Docker Compose (Production-like Environment)

Perfect for testing the full stack or demonstrating the application.

```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Stop everything
docker-compose down

# Stop and remove data
docker-compose down -v
```

**Services Started:**
- `postgres` - PostgreSQL database on port 5432
- `backend` - .NET API on port 5000
- `frontend` - React app on port 3000

### Local Development (Hot Reload)

Recommended for active development with instant code reloading.

#### Terminal 1: Backend (with hot reload)

```bash
cd backend

# First time setup
dotnet restore
dotnet ef database update --project src/UserAuth.Infrastructure --startup-project src/UserAuth.API

# Run with hot reload
cd src/UserAuth.API
dotnet watch run
```

**Configuration:**  
Update `backend/src/UserAuth.API/appsettings.Development.json` if needed:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=userauth;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "SecretKey": "ThisIsAVerySecretKeyForJWTTokenGenerationWithAtLeast32Characters!",
    "Issuer": "UserAuthAPI",
    "Audience": "UserAuthClient"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

#### Terminal 2: Frontend (with hot reload)

```bash
cd frontend

# First time setup
npm install

# Run development server
npm run dev
```

**Configuration:**  
Update `frontend/.env` or `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

**Frontend Development Server:**
- Runs on http://localhost:3000
- Hot module replacement (HMR) enabled
- Instant updates on file save
- TypeScript type checking

#### Terminal 3: Database (optional - if not installed locally)

```bash
# Option 1: PostgreSQL via Docker
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=userauth \
  -p 5432:5432 \
  postgres:15-alpine

# Option 2: Use PostgreSQL container from docker-compose
docker-compose up -d postgres
```

### Hybrid Approach

Mix Docker and local development as needed:

**Backend + Database in Docker, Frontend locally:**
```bash
# Start database and backend
docker-compose up -d postgres backend

# Run frontend locally for fast iterations
cd frontend
npm run dev
```

**Database in Docker, Backend + Frontend locally:**
```bash
# Start only database
docker-compose up -d postgres

# Terminal 1: Backend
cd backend/src/UserAuth.API
dotnet watch run

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🧪 Testing

### Frontend Tests

#### Run all tests
```bash
cd frontend
npm test
```

#### Run with coverage
```bash
npm run test:coverage
```

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
cd backend
coverage.bat
```

This generates an HTML coverage report at `backend/CoverageReport/index.html`

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
Wonga/
├── frontend/                                 # React TypeScript frontend
│   ├── public/                              # Static assets
│   │   └── assets/                          # Images, icons, favicon
│   ├── src/
│   │   ├── components/                      # Reusable React components
│   │   │   └── ProtectedRoute.tsx          # Route protection wrapper
│   │   ├── pages/                          # Page components
│   │   │   ├── Login.tsx                   # Login page
│   │   │   ├── Login.css                   # Login page styles
│   │   │   ├── Register.tsx                # Registration page
│   │   │   ├── Register.css                # Registration page styles
│   │   │   ├── Profile.tsx                 # User profile page
│   │   │   └── Profile.css                 # Profile page styles
│   │   ├── services/                       # API service layer
│   │   │   └── authService.ts              # Authentication API calls
│   │   ├── store/                          # State management (Zustand)
│   │   │   └── authStore.ts                # Auth state and actions
│   │   ├── types/                          # TypeScript type definitions
│   │   │   └── auth.ts                     # Auth-related types
│   │   ├── test/                           # Test files
│   │   │   ├── components/
│   │   │   │   └── ProtectedRoute.test.tsx # ProtectedRoute tests
│   │   │   ├── pages/
│   │   │   │   ├── Login.test.tsx          # Login page tests
│   │   │   │   ├── Register.test.tsx       # Register page tests
│   │   │   │   └── Profile.test.tsx        # Profile page tests
│   │   │   ├── services/
│   │   │   │   └── authService.test.ts     # Auth service tests
│   │   │   ├── store/
│   │   │   │   └── authStore.test.ts       # Auth store tests
│   │   │   ├── integration/                # Integration tests
│   │   │   └── setup.ts                    # Test configuration
│   │   ├── App.tsx                         # Root component with routing
│   │   ├── main.tsx                        # Application entry point
│   │   ├── index.css                       # Global styles
│   │   └── vite-env.d.ts                   # Vite type definitions
│   ├── .dockerignore                       # Docker ignore rules
│   ├── .env.example                        # Environment variables template
│   ├── .eslintrc.cjs                       # ESLint configuration
│   ├── .gitignore                          # Git ignore rules
│   ├── Dockerfile                          # Frontend container definition
│   ├── index.html                          # HTML entry point
│   ├── nginx.conf                          # Nginx configuration
│   ├── package.json                        # NPM dependencies and scripts
│   ├── package-lock.json                   # NPM lock file
│   ├── README.md                           # Frontend documentation
│   ├── tsconfig.json                       # TypeScript configuration
│   ├── tsconfig.node.json                  # TypeScript node configuration
│   ├── vite.config.ts                      # Vite configuration
│   └── vitest.config.ts                    # Vitest test configuration
│
├── backend/                                 # .NET 8 C# backend
│   ├── src/
│   │   ├── UserAuth.Domain/                # Domain layer (Core)
│   │   │   ├── Common/                     # Shared domain entities
│   │   │   │   └── BaseEntity.cs          # Base entity class
│   │   │   ├── Entities/                  # Domain entities
│   │   │   │   ├── User.cs                # User entity
│   │   │   │   └── RefreshToken.cs        # Refresh token entity
│   │   │   ├── Repositories/              # Repository interfaces
│   │   │   │   ├── IUserRepository.cs     # User repository interface
│   │   │   │   └── IUnitOfWork.cs         # Unit of work interface
│   │   │   └── UserAuth.Domain.csproj     # Domain project file
│   │   │
│   │   ├── UserAuth.Application/           # Application layer (Business logic)
│   │   │   ├── Common/
│   │   │   │   └── Exceptions/            # Custom exceptions
│   │   │   ├── DTOs/
│   │   │   │   └── Auth/                  # Authentication DTOs
│   │   │   ├── Mappings/
│   │   │   │   └── MappingProfile.cs      # AutoMapper profiles
│   │   │   ├── Services/                  # Service interfaces
│   │   │   │   ├── IAuthService.cs        # Auth service interface
│   │   │   │   ├── ITokenService.cs       # Token service interface
│   │   │   │   └── Impl/                  # Service implementations
│   │   │   ├── Validators/                # FluentValidation validators
│   │   │   │   ├── LoginRequestValidator.cs       # Login validation
│   │   │   │   └── RegisterRequestValidator.cs    # Register validation
│   │   │   ├── DependencyInjection.cs     # DI configuration
│   │   │   └── UserAuth.Application.csproj # Application project file
│   │   │
│   │   ├── UserAuth.Infrastructure/        # Infrastructure layer (Data access)
│   │   │   ├── Migrations/                # EF Core migrations
│   │   │   │   ├── 20260227161004_InitialCreate.cs
│   │   │   │   ├── 20260227161004_InitialCreate.Designer.cs
│   │   │   │   └── ApplicationDbContextModelSnapshot.cs
│   │   │   ├── Persistence/               # Database context
│   │   │   │   ├── ApplicationDbContext.cs    # EF Core DbContext
│   │   │   │   └── Configurations/           # Entity configurations
│   │   │   ├── Repositories/              # Repository implementations
│   │   │   │   ├── UserRepository.cs      # User repository
│   │   │   │   └── UnitOfWork.cs          # Unit of work
│   │   │   ├── Services/                  # External services
│   │   │   ├── DependencyInjection.cs     # DI configuration
│   │   │   └── UserAuth.Infrastructure.csproj # Infrastructure project file
│   │   │
│   │   └── UserAuth.API/                   # API layer (Presentation)
│   │       ├── Controllers/                # API controllers
│   │       │   └── AuthController.cs      # Authentication endpoints
│   │       ├── Middleware/                 # Custom middleware
│   │       │   └── ExceptionHandlingMiddleware.cs
│   │       ├── Properties/
│   │       │   └── launchSettings.json    # Launch configuration
│   │       ├── appsettings.json           # Production configuration
│   │       ├── appsettings.Development.json # Development configuration
│   │       ├── Program.cs                  # Application entry point
│   │       └── UserAuth.API.csproj        # API project file
│   │
│   ├── tests/
│   │   ├── UserAuth.Tests.Unit/            # Unit tests
│   │   │   ├── Application/               # Application layer tests
│   │   │   ├── Infrastructure/            # Infrastructure layer tests
│   │   │   ├── Usings.cs                  # Global usings
│   │   │   └── UserAuth.Tests.Unit.csproj # Test project file
│   │   │
│   │   └── UserAuth.Tests.Integration/     # Integration tests
│   │       ├── Controllers/               # Controller integration tests
│   │       ├── Usings.cs                  # Global usings
│   │       └── UserAuth.Tests.Integration.csproj # Test project file
│   │
│   ├── .gitignore                          # Git ignore rules
│   ├── coverage.bat                        # Backend coverage script
│   ├── Dockerfile                          # Backend container definition
│   ├── README.md                           # Backend documentation
│   └── UserAuth.sln                        # Visual Studio solution file
│
├── .github/
│   └── workflows/
│       └── coverage.yml                    # GitHub Actions CI/CD workflow
│
├── .env.example                             # Environment variables template
├── .gitignore                               # Root Git ignore rules
├── docker-compose.yml                       # Development Docker Compose
├── docker-compose.prod.yml                  # Production Docker Compose
└── README.md                                # This file - Main documentation
```

## 💻 Development

### Frontend Development

#### Available Scripts

```bash
cd frontend

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint TypeScript/React code
npm run lint

# Type checking
npm run type-check
```

#### Adding New Features

**1. Create a new page:**
```typescript
// src/pages/NewPage.tsx
import { useAuthStore } from '../store/authStore';

export default function NewPage() {
  const { user } = useAuthStore();
  
  return (
    <main>
      <h1>New Page</h1>
      <p>Welcome, {user?.firstName}!</p>
    </main>
  );
}
```

**2. Add route:**
```typescript
// src/App.tsx
import NewPage from './pages/NewPage';

// Add to routes
<Route path="/new-page" element={<NewPage />} />
```

**3. Write tests:**
```typescript
// src/test/pages/NewPage.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewPage from '../../pages/NewPage';

describe('NewPage', () => {
  it('renders page title', () => {
    render(<NewPage />);
    expect(screen.getByText('New Page')).toBeInTheDocument();
  });
});
```

#### Frontend Environment Variables

Create `frontend/.env.local` for local overrides:
```env
VITE_API_URL=http://localhost:5000/api
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Backend Development

#### Database Migrations

**Add a new migration:**
```bash
cd backend
dotnet ef migrations add MigrationName \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
```

**Update database:**
```bash
dotnet ef database update \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
```

**Remove last migration:**
```bash
dotnet ef migrations remove \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
```

**List all migrations:**
```bash
dotnet ef migrations list \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
```

#### Adding New Endpoints

**1. Create DTO:**
```csharp
// UserAuth.Application/DTOs/NewFeature/RequestDto.cs
public class RequestDto
{
    public string Name { get; set; } = string.Empty;
}
```

**2. Create Service:**
```csharp
// UserAuth.Application/Services/INewService.cs
public interface INewService
{
    Task<ResponseDto> DoSomethingAsync(RequestDto request);
}
```

**3. Add Controller:**
```csharp
// UserAuth.API/Controllers/NewController.cs
[ApiController]
[Route("api/[controller]")]
public class NewController : ControllerBase
{
    private readonly INewService _service;
    
    public NewController(INewService service)
    {
        _service = service;
    }
    
    [HttpPost]
    public async Task<ActionResult<ResponseDto>> Create(RequestDto request)
    {
        var result = await _service.DoSomethingAsync(request);
        return Ok(result);
    }
}
```

**4. Register in DI:**
```csharp
// UserAuth.Application/DependencyInjection.cs
services.AddScoped<INewService, NewService>();
```

#### Code Quality

**Format code:**
```bash
cd backend
dotnet format
```

**Run code analysis:**
```bash
dotnet build /p:AnalysisMode=All
```

### Full Stack Development Tips

#### 1. Use Hot Reload for Both
```bash
# Terminal 1: Backend with hot reload
cd backend/src/UserAuth.API
dotnet watch run

# Terminal 2: Frontend with hot reload
cd frontend
npm run dev
```

#### 2. Debug Frontend API Calls

Check browser console and Network tab:
```typescript
// Enable verbose logging in authService.ts
console.log('API Request:', url, data);
console.log('API Response:', response);
```

#### 3. Database Management

**View database:**
```bash
# Connect with psql
docker exec -it userauth-postgres psql -U postgres -d userauth

# List tables
\dt

# View users
SELECT * FROM "Users";

# Exit
\q
```

**Reset database:**
```bash
# Drop and recreate (WARNING: Deletes all data)
dotnet ef database drop -f \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
  
dotnet ef database update \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
```

#### 4. CORS Issues

If frontend can't connect to backend:

**Backend** (appsettings.Development.json):
```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

**Frontend** (check .env):
```env
VITE_API_URL=http://localhost:5000/api
```

#### 5. JWT Token Debugging

Check token in browser DevTools:
- Application → Local Storage → `http://localhost:3000`
- Look for `token` and `user` keys

Decode token at: https://jwt.io/

## 🚢 Deployment

### Production Deployment with Docker

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Start production services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Check service health**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   curl http://localhost:5000/health
   ```

### Environment Variables

**Production Configuration:**

Create `.env` file in project root:
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=userauth

# Backend
ASPNETCORE_ENVIRONMENT=Production
JWT_SECRET_KEY=your_very_secure_jwt_secret_minimum_32_characters
JWT_ISSUER=UserAuthAPI
JWT_AUDIENCE=UserAuthClient

# Frontend
VITE_API_URL=https://api.yourdomain.com/api
```

**Security Notes:**
- Never commit `.env` to version control
- Use strong, unique passwords
- JWT secret should be at least 32 characters
- Rotate secrets regularly

## 🔧 Troubleshooting

### Common Issues

#### Frontend Issues

**1. Frontend can't connect to backend**
```bash
# Check API URL in browser console
# Verify VITE_API_URL in frontend/.env
VITE_API_URL=http://localhost:5000/api

# Restart frontend dev server
cd frontend
npm run dev
```

**2. Login/Register not working**
```bash
# Check backend is running
curl http://localhost:5000/health

# Check browser console for errors
# Verify network tab shows requests to /api/auth/*
```

**3. TypeScript errors**
```bash
cd frontend
npm run type-check
npm install  # If missing dependencies
```

**4. Tests failing**
```bash
cd frontend
npm test
# Check test output for specific failures
```

#### Backend Issues

**1. Backend won't start**
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection string in appsettings.Development.json
# Verify port 5000 is not in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux
```

**2. Database migration errors**
```bash
cd backend

# Check migration status
dotnet ef migrations list \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API

# Reset database (WARNING: Deletes all data)
dotnet ef database drop -f \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
  
dotnet ef database update \
  --project src/UserAuth.Infrastructure \
  --startup-project src/UserAuth.API
```

**3. JWT errors**
```bash
# Ensure JWT secret is at least 32 characters
# Check appsettings.json or environment variables
{
  "Jwt": {
    "SecretKey": "At_Least_32_Characters_Long_Secret_Key_Here!"
  }
}
```

**4. CORS errors in browser**
```bash
# Add frontend URL to backend CORS configuration
# appsettings.Development.json:
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}

# Restart backend
cd backend/src/UserAuth.API
dotnet run
```

#### Docker Issues

**1. Docker containers won't start**
```bash
# Check Docker is running
docker ps

# View container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**2. Port conflicts**
```bash
# Check what's using ports
netstat -ano | findstr :3000  # Frontend
netstat -ano | findstr :5000  # Backend
netstat -ano | findstr :5432  # PostgreSQL

# Change ports in docker-compose.yml if needed
```

**3. Database connection issues**
```bash
# Test PostgreSQL connection
docker exec -it userauth-postgres psql -U postgres -d userauth

# Check database exists
\l

# Check tables
\dt
```

**4. Container keeps restarting**
```bash
# View full logs
docker-compose logs -f backend

# Check environment variables
docker-compose config

# Rebuild specific service
docker-compose up -d --build backend
```

#### Build Issues

**Frontend build errors:**
```bash
cd frontend

# Clear build cache
rm -rf node_modules
rm -rf dist
rm package-lock.json

# Reinstall
npm install
npm run build
```

**Backend build errors:**
```bash
cd backend

# Clean and restore
dotnet clean
dotnet restore
dotnet build
```

### Performance Tips

**Frontend:**
- Enable production build: `npm run build`
- Use lazy loading for routes
- Optimize images in `public/assets/`
- Enable gzip compression in Nginx

**Backend:**
- Use `AsNoTracking()` for read-only queries
- Implement caching for frequently accessed data
- Use connection pooling (default in Npgsql)
- Add database indexes for common queries

**Database:**
- Regular vacuum: `VACUUM ANALYZE;`
- Monitor connection pool size
- Add indexes on foreign keys
- Use read replicas for scaling

### Getting Help

**Check logs:**
```bash
# Frontend browser console
# Backend: docker-compose logs backend
# Database: docker-compose logs postgres
```

**Common commands:**
```bash
# Health check endpoints
curl http://localhost:5000/health
curl http://localhost:3000

# View all running containers
docker ps

# Restart a specific service
docker-compose restart backend

# Full reset (WARNING: Deletes data)
docker-compose down -v
docker-compose up -d --build
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
