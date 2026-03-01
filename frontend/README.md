# Frontend - Wonga Finance User Authentication

A modern React + TypeScript frontend application for Wonga Finance user authentication with a corporate white and light blue theme.

## Features

- **Corporate Wonga Finance Theme**: Professional white and light blue color scheme matching Wonga's brand identity
- **Registration Page**: Create new user accounts with validation
- **Login Page**: Email and password authentication
- **User Profile**: Display user information after successful login
- **Protected Routes**: Route guards for authenticated users
- **State Management**: Zustand for efficient state management
- **API Integration**: Axios for HTTP requests
- **Testing**: Comprehensive unit and integration tests with Vitest
- **Type Safety**: Full TypeScript support
- **Form Validation**: Client-side password strength and matching validation

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite
- **Routing**: React Router 6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS3

## Prerequisites

- Node.js 20 or higher
- npm or yarn

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Docker

### Build Docker Image

```bash
docker build -t userauth-frontend .
```

### Run Docker Container

```bash
docker run -p 3000:80 userauth-frontend
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx    # Route guard component
│   ├── pages/
│   │   ├── Login.tsx              # Login page
│   │   ├── Login.css
│   │   ├── Register.tsx           # Registration page
│   │   ├── Register.css
│   │   ├── Profile.tsx            # User profile page
│   │   └── Profile.css
│   ├── services/
│   │   └── authService.ts         # API service
│   ├── store/
│   │   └── authStore.ts           # Zustand store
│   ├── test/
│   │   ├── integration/           # Integration tests
│   │   ├── pages/                 # Page component tests
│   │   ├── store/                 # Store tests
│   │   └── setup.ts               # Test setup
│   ├── types/
│   │   └── auth.ts                # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles
│   └── vite-env.d.ts              # Vite types
├── public/
├── Dockerfile
├── nginx.conf                     # Nginx configuration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## API Integration

The frontend integrates with the backend API for:

- **POST /api/auth/register**: User registration
- **POST /api/auth/login**: User login
- **GET /api/auth/me**: Get current user details

## Features

### Registration Page
- First name and last name input fields
- Email validation
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&*)
- Password confirmation matching
- Real-time validation feedback
- Link to login page

### Login Page
- Email and password input fields
- Form validation
- Error message display
- Loading state during authentication
- JWT token storage
- Link to registration page

### Profile Page
- User information display (name, email, ID)
- Account creation date
- User avatar with initials
- Wonga Finance branding
- Logout functionality

### Protected Routes
- Automatic redirect to login if not authenticated
- Token-based authentication
- Persistent authentication across page refreshes

## Design System

### Wonga Finance Brand Colors

```css
--wonga-blue: #0066CC           /* Primary brand color */
--wonga-light-blue: #4A9FDB     /* Secondary blue */
--wonga-lighter-blue: #E8F4FF   /* Background tint */
--wonga-dark-blue: #004A99      /* Hover states */
--wonga-white: #FFFFFF          /* Background */
```

### Typography
- Font Family: 'Segoe UI', -apple-system, BlinkMacSystemFont
- Corporate, professional appearance
- Clear hierarchy and readability

## Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- State management
- Service functions

### Integration Tests
- Complete user flows
- Route navigation
- API integration
- Error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before committing

## License

MIT
