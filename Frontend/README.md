# Concert Booking System

A complete microservices-based concert booking system with Go backend services and React frontend.

## Architecture

### Backend Services (Go)
- **User Service** (Port 8001): Authentication and user management
- **Booking Service** (Port 8002): Concert listings and booking management
- **Payment Service** (Port 8003): Payment processing with Stripe integration

### Frontend (React)
- Modern React application with TypeScript
- React Router for navigation
- React Query for API state management
- Formik + Yup for form validation
- Tailwind CSS for styling

## Tech Stack

### Backend
- **Language**: Go 1.21
- **Framework**: Gin
- **Database**: MySQL 8.0
- **Logging**: Logrus
- **Payment**: Stripe
- **Authentication**: JWT

### Frontend
- **Framework**: React 18 + TypeScript
- **Routing**: React Router DOM
- **State Management**: React Query
- **Forms**: Formik + Yup
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Project Structure

```
├── user-service/
│   ├── main.go
│   ├── config/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   ├── router/
│   └── docs/
├── booking-service/
│   ├── main.go
│   ├── config/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   ├── router/
│   └── docs/
├── payment-service/
│   ├── main.go
│   ├── config/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   ├── router/
│   └── docs/
├── src/ (React Frontend)
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── ...
├── docker-compose.yml
└── init-db.sql
```

## Features

### User Management
- User registration and authentication
- JWT-based authorization
- Profile management

### Concert Booking
- Browse available concerts
- View concert details
- Book tickets with quantity selection
- Real-time seat availability

### Payment Processing
- Secure payment with Stripe
- Payment status tracking
- Booking confirmation

### Frontend Features
- Responsive design
- Modern UI with glassmorphism effects
- Form validation
- Loading states and error handling
- Mock API integration for development

## Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- MySQL 8.0
- Docker & Docker Compose (optional)

### Running with Docker Compose

1. Clone the repository
2. Set up environment variables in docker-compose.yml
3. Run the system:

```bash
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- User service on port 8001
- Booking service on port 8002
- Payment service on port 8003
- Frontend on port 3000

### Running Locally

#### Backend Services

1. Set up MySQL database and run init-db.sql
2. For each service:

```bash
cd user-service
go mod tidy
go run main.go
```

#### Frontend

```bash
npm install
npm run dev
```

## API Endpoints

### User Service (8001)
- POST /api/v1/users/register
- POST /api/v1/users/login
- GET /api/v1/users/profile

### Booking Service (8002)
- GET /api/v1/concerts
- GET /api/v1/concerts/:id
- POST /api/v1/bookings
- GET /api/v1/bookings/user

### Payment Service (8003)
- POST /api/v1/payments
- GET /api/v1/payments/:id
- GET /api/v1/payments/user
- POST /api/v1/webhook/stripe

## Environment Variables

### User Service
- PORT=8001
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=root
- DB_PASS=password
- DB_NAME=concert_booking_users
- JWT_SECRET=your-secret-key

### Booking Service
- PORT=8002
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=root
- DB_PASS=password
- DB_NAME=concert_booking_bookings

### Payment Service
- PORT=8003
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=root
- DB_PASS=password
- DB_NAME=concert_booking_payments
- STRIPE_SECRET_KEY=your-stripe-key

## Development Notes

The frontend currently uses mock API integration for development purposes. To connect to the actual Go services:

1. Update the API base URLs in the frontend
2. Implement proper API calls replacing the mock functions
3. Handle authentication tokens in API requests

## Production Deployment

1. Set up proper environment variables
2. Configure SSL certificates
3. Set up reverse proxy (nginx)
4. Configure database with proper credentials
5. Set up monitoring and logging
6. Configure CI/CD pipeline

## License

MIT License