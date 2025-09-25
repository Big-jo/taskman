# 🚀 Task Management API

A task management system built with NestJS, featuring user authentication, task CRUD operations, comments, and real-time notifications.

## ✨ Features

- 🔐 **User Authentication** - JWT-based authentication with bcrypt password hashing
- 📝 **Task Management** - Create, read, update, and delete tasks with status tracking
- 💬 **Comments System** - Add comments to tasks with user attribution
- 🔔 **Real-time Notifications** - Bull queue-based task completion notifications
- 📊 **Pagination** - Efficient data pagination for large datasets
- 🗄️ **Database Integration** - PostgreSQL with TypeORM for robust data persistence
- 🐳 **Docker Support** - Full containerization with Docker Compose

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Authentication**: JWT + bcrypt
- **Queue**: Bull (Redis-based)
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd task-man

# Create environment file
cp .env.example .env
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=taskman-db

# Application Configuration
PORT=8000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Security Configuration
SALT_ROUNDS=10

# Redis Configuration (for Bull queues)
REDIS_HOST=redis
REDIS_PORT=6379
```

### 3. Run with Docker Compose

```bash
# Start all services (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 4. Access the Application

- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api (Swagger UI)
- **Database**: localhost:7432 (PostgreSQL)

## 🛠️ Development Setup

### Local Development (without Docker)

```bash
# Install dependencies
yarn install

# Start PostgreSQL locally (or use Docker)
docker run -d --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=taskman-db \
  -p 5432:5432 \
  postgres:16

# Run database migrations
yarn run migration:run

# Start development server
yarn run start:dev
```

### Available Scripts

```bash
# Development
yarn run start:dev          # Start with hot reload
yarn run start:debug        # Start with debugging

# Production
yarn run build              # Build the application
yarn run start:prod         # Start production server

# Testing
yarn run test               # Run unit tests
yarn run test:watch         # Run tests in watch mode
yarn run test:cov           # Run tests with coverage
yarn run test:e2e           # Run end-to-end tests
```

## 🐳 Docker Configuration

### Docker Compose Services

The application uses Docker Compose to orchestrate multiple services:

- **`app`**: NestJS application container
- **`postgres`**: PostgreSQL 16 database
- **`redis`**: Redis for Bull queue

### Docker Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs for specific service
docker-compose logs -f app
docker-compose logs -f postgres

# Execute commands in running container
docker-compose exec app sh
docker-compose exec postgres psql -U postgres -d taskman-db

# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Rebuild specific service
docker-compose build app
```