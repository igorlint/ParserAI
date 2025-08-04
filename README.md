# G. Stocks Inventory Management Service

This repository contains the G. Stocks application, an inventory-management service for tracking and reserving stock across warehouses.

## Repository Structure

- `/g-stocks-service`: NestJS backend project
  - `src/`: application code
  - `package.json`, `tsconfig.json`, etc.
- `/frontend`: React frontend project (Vite + React + TypeScript + MUI)
  - `src/`: UI components, pages, services
  - `vite.config.ts`, `package.json`, etc.

## Prerequisites

- Node.js >= 18 and npm
- Docker & Docker Compose (optional, for Postgres & RabbitMQ)
- Alternatively, a running PostgreSQL and RabbitMQ instance

## Environment Variables

Create a `.env` file in the `/g-stocks-service` directory with the following:

```dotenv
DB_HOST=<your_db_host>
DB_PORT=5432
DB_USER=<your_db_user>
DB_PASS=<your_db_password>
DB_NAME=<your_db_name>
RABBITMQ_URI=amqp://<user>:<pass>@<host>:5672
PORT=3000
```

## Backend Setup (NestJS)

1. Install dependencies:
   ```bash
   cd g-stocks-service
   npm install
   ```
2. Start the development server:
   ```bash
   npm run start:dev
   ```
3. API is available at `http://localhost:3000/api`

## Frontend Setup (React)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Frontend is available at `http://localhost:5173` and proxies `/api` requests to the backend.

## Docker Compose (Optional)

To run Postgres and RabbitMQ locally using Docker Compose, create a `docker-compose.yml` (example):

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: gstocks
    ports:
      - "5432:5432"

  rabbitmq:
    image: rabbitmq:3-management
    environment:
      RABBITMQ_DEFAULT_USER: user
      RABBITMQ_DEFAULT_PASS: pass
    ports:
      - "5672:5672"
      - "15672:15672"
```

## Next Steps

- Implement business logic in `EventsService` for order events
- Write unit and integration tests for backend modules
- Develop frontend reservation flow
- Dockerize full stack

## License

