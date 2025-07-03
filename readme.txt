# Ticket Booking System

## Overview
Ticket Booking System is a full-stack application designed to facilitate booking and management of event tickets. It consists of a backend built with Go microservices and a frontend built with React and Next.js.

## Table of Contents
- [Backend](#backend)
- [Frontend](#frontend)
- [Documentation](#documentation)
- [Setup](#setup)
- [Usage](#usage)

## Backend
The backend of Ticket Booking System is built using:
- **Go (Golang)**: A statically typed, compiled programming language designed for scalability and concurrency.
- **Microservices Architecture**: The backend is split into multiple services (User, Booking, Payment) for modularity and scalability.
- **GORM**: An ORM library for Go, used for database interactions.
- **Gin**: A web framework for building RESTful APIs in Go.

## Frontend
The frontend of Ticket Booking System is built using:
- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for production, supporting server-side rendering and static site generation.

## Documentation
The project includes the following documentation:
- **Postman Collection**: A collection of API requests for testing and development.
- **ERD (Entity-Relationship Diagram)**: A diagram that shows the relationships between different entities in the database.

## Setup
To set up the project locally, follow these steps:

### Prerequisites
- Go 1.18+
- MySQL
- [golang-migrate](https://github.com/golang-migrate/migrate)

### Backend
1. Clone the repository.
2. Navigate to the `Backend` directory.
3. **Setup Databases:**
    Create the necessary databases in MySQL:
    ```sql
    CREATE DATABASE concert_booking_users;
    CREATE DATABASE concert_booking_bookings;
    CREATE DATABASE concert_booking_payments;
    ```
4. **Install `golang-migrate`:**
    ```sh
    go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
    ```
5. **Run Migrations:**
    For each service, navigate to its directory and run the migrations. Replace `root` with your MySQL user if it is different.
    *   **User Service:**
        ```sh
        migrate -path ./Backend/user-service/migrations -database "mysql://root@tcp(localhost:3306)/concert_booking_users" up
        ```
    *   **Booking Service:**
        ```sh
        migrate -path ./Backend/booking-service/migrations -database "mysql://root@tcp(localhost:3306)/concert_booking_bookings" up
        ```
    *   **Payment Service:**
        ```sh
        migrate -path ./Backend/payment-service/migrations -database "mysql://root@tcp(localhost:3306)/concert_booking_payments" up
        ```
6. **Install Go dependencies:**
   For each service (`user-service`, `booking-service`, `payment-service`), install dependencies:
    ```bash
    go mod tidy
    ```
7. Set up environment variables as per the `config/config.go` files in each service.
8. Start each backend service from its respective directory:
    ```bash
    go run main.go
    ```

### Frontend
1. Navigate to the `Frontend` directory.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the frontend server:
    ```bash
    npm run dev
    ```

## Usage
Once the setup is complete, you can access the application at `http://localhost:3000` for the frontend. Backend services will run on their respective ports as configured in each service.

For detailed API documentation and usage, refer to the Postman collection and the user guide provided in the documentation folder.