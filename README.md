# iPhone Flash Sale API

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [System Architecture](#Architecture)
4. [Technical Stack](#technical-stack)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Running the Application](#running-the-application)
8. [API Endpoints](#api-endpoints)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

## Project Overview

The iPhone Flash Sale API is a robust backend system designed to manage high-demand, time-sensitive sales events, particularly suited for scenarios like iPhone flash sales. It provides a scalable and efficient platform for creating, managing, and executing flash sales while ensuring fair distribution and system stability under high load.

## Features

- Sale event management (create, retrieve, update)
- Concurrent user handling with Node.js clustering
- Fair distribution algorithms for purchase opportunities
- Real-time inventory management
- High-performance caching with Redis
- Scalable architecture using Docker
- Rate limiting to prevent API abuse

## Architecture

<img width="928" alt="Screenshot 2024-08-30 at 6 17 07 PM" src="https://github.com/user-attachments/assets/9914a1ac-ac41-4895-a163-74ba40d6402d">


## Technical Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Containerization**: Docker and Docker Compose
- **Process Management**: Node.js Cluster API

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/iphone-flash-sale-api.git
   cd iphone-flash-sale-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URI=mongodb://mongo:27017/iphone-flash-sale
   REDIS_URL=redis://redis:6379
   PORT=3000
   ```

## Running the Application

### Using Docker (Recommended)

1. Build and start the containers:
   ```
   docker-compose up --build
   ```

2. The API will be available at `http://localhost:3000`

### Without Docker (For Development)

1. Ensure MongoDB and Redis are running locally

2. Start the application:
   ```
   npm start
   ```

3. For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### 1. Manage Sales
- **Endpoint**: `http://localhost:3000/api/sales`
- **Method**: POST
- **Description**: Allows creation of flash sale events by Admin.
- **Request Body**:
  - `itemName` (string): Name of the item for sale
  - `quantity` (number): Total quantity available for the sale
  - `startTime` (string): ISO 8601 formatted date-time for the start of the sale
```bash
# Create a new sale
curl -X POST http://localhost:3000/api/sales \
  -H "Content-Type: application/json" \
  -d '{"itemName": "iPhone 13", "quantity": 1000, "startTime": "2023-09-01T10:00:00Z"}'
```

### 2. Check Available Phones
- **Endpoint**: `http://localhost:3000/api/phones/available`
- **Method**: GET
- **Description**: Returns the current number of available iPhones for purchase in the active sale.
```bash
# Check available phones
curl http://localhost:3000/api/phones/available
```

### 3. Pick Up Phone
- **Endpoint**: `http://localhost:3000/api/phones/pickup`
- **Method**: POST
- **Description**: Allows a user to "pick up" (reserve) an iPhone for a short period before purchase.
- **Request Body**:
  - `userId` (string): Unique identifier for the user
```bash
# Pick up a phone
curl -X POST http://localhost:3000/api/phones/pickup \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123","phoneId": "phone456"}'
```

### 4. Purchase Phone
- **Endpoint**: `http://localhost:3000/api/phones/purchase`
- **Method**: POST
- **Description**: Completes the purchase process for a picked-up iPhone.
- **Request Body**:
  - `userId` (string): Unique identifier for the user
  - `phoneId` (string): Unique identifier for the picked-up phone
```bash
# Purchase a phone
curl -X POST http://localhost:3000/api/phones/purchase \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "phoneId": "phone456"}'
```

### Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: When the request is malformed or missing required fields.
- `401 Unauthorized`: When the request lacks proper authentication (if implemented).
- `403 Forbidden`: When the user doesn't have permission for the requested action.
- `404 Not Found`: When the requested resource (sale, phone) is not found.
- `409 Conflict`: When there's a conflict with the current state (e.g., trying to purchase an already sold phone).
- `500 Internal Server Error`: For any server-side errors.

## Deployment

The application is containerized and can be easily deployed to any platform that supports Docker.

For cloud deployment (example with AWS ECS):
1. Push your Docker image to Amazon ECR
2. Create an ECS cluster and task definition
3. Deploy the task on ECS

Detailed deployment instructions can be found in `DEPLOYMENT.md`.

## Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
