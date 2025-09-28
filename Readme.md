# Inventory Management System API

![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.0+-blue.svg)
![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A robust, scalable backend API for tracking products and managing inventory in a warehouse environment. Built with TypeScript, Node.js, Express, and MongoDB with comprehensive audit logging and real-time stock tracking.

## 📋 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Data Models](#-data-models)
- [Testing](#-testing)
- [Environment Variables](#-environment-variables)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### Core Features
- **Product Management**: Complete CRUD operations for products with validation
- **Inventory Control**: Real-time stock tracking with automatic validation
- **Stock Operations**: Secure increase/decrease stock operations with business logic
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Data Validation**: Input validation and sanitization on all endpoints

### Advanced Features
- **Low Stock Alerts**: Automatic detection and reporting of products below threshold
- **Audit Logging**: Complete audit trail for all inventory changes and operations
- **Unit Testing**: Comprehensive test suite covering edge cases and error scenarios
- **RESTful Design**: Clean, intuitive API design following REST principles

## 🏗 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Client Apps   │────│   Express API   │────│   MongoDB       │
│                 │    │                 │    │   Atlas         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                       ┌─────────────────┐
                       │                 │
                       │  Audit Logger   │
                       │                 │
                       └─────────────────┘

Application Flow:
┌─────────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────────┐
│   Routes    │──▶│ Controllers  │──▶│  Services   │──▶│   Models     │
│             │   │              │   │             │   │              │
│ API Gateway │   │ Request      │   │ Business    │   │ Data Layer   │
│             │   │ Handlers     │   │ Logic       │   │              │
└─────────────┘   └──────────────┘   └─────────────┘   └──────────────┘
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js (v16+) |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB Atlas |
| **ODM** | Mongoose |
| **Testing** | Jest + Supertest |
| **Environment** | dotenv |
| **Validation** | Express Validator |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Git](https://git-scm.com/) for version control

## ⚡ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd inventory-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. MongoDB Atlas Setup

1. **Create Cluster**: Sign up and create a cluster in [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Database User**: Create a database user with read/write permissions
3. **Network Access**: Add your IP address to the whitelist
4. **Connection String**: Copy the connection string and update the `.env` file
5. **Replace Variables**: Update `<username>`, `<password>`, and `<cluster>` in your connection string

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/inventory_db?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development
```


### 5. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔗 API Endpoints

### Product Management

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/v1/products` | Get all products | 200, 500 |
| `POST` | `/api/v1/products` | Create new product | 201, 400, 500 |
| `GET` | `/api/v1/products/:id` | Get product by ID | 200, 404, 500 |
| `PUT` | `/api/v1/products/:id` | Update product | 200, 400, 404, 500 |
| `DELETE` | `/api/v1/products/:id` | Delete product | 200, 404, 500 |
| `GET` | `/api/v1/products/low-stock` | Get low stock products | 200, 500 |

### Inventory Operations

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `POST` | `/api/v1/stocks/:id/increase` | Increase stock quantity | 200, 400, 404, 500 |
| `POST` | `/api/v1/stocks/:id/decrease` | Decrease stock quantity | 200, 400, 404, 500 |

### Audit Logs

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| `GET` | `/api/v1/products/:id/audit-logs` | Get product audit history | 200, 404, 500 |

### Example API Usage

#### Create a Product
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse with USB receiver",
    "stock_quantity": 50,
    "low_stock_threshold": 10
  }'
```

#### Increase Stock
```bash
curl -X POST http://localhost:3000/api/v1/stocks/[product-id]/increase \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 25
  }'
```

## 📊 Data Models

### Product Schema

```typescript
interface Product {
  _id: ObjectId;
  name: string;           // Required, unique
  description: string;    // Required
  stock_quantity: number; // Required, minimum: 0
  low_stock_threshold: number; // Default: 10
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

### Audit Log Schema

```typescript
interface AuditLog {
  _id: ObjectId;
  product_id: ObjectId;   // Required, references Product
  action_type: ActionType; // Required, enum values
  old_values: Object;     // Previous state (for updates)
  new_values: Object;     // New state
  timestamp: Date;        // Auto-generated
}

enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE', 
  DELETE = 'DELETE',
  STOCK_INCREASE = 'STOCK_INCREASE',
  STOCK_DECREASE = 'STOCK_DECREASE'
}
```

### Sample Data

```json
{
  "name": "Bluetooth Headphones",
  "description": "Noise-canceling wireless headphones",
  "stock_quantity": 75,
  "low_stock_threshold": 15
}
```

## 🧪 Testing

The project includes comprehensive unit tests and integration tests.

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The test suite covers:
- ✅ All CRUD operations
- ✅ Stock increase/decrease operations  
- ✅ Input validation
- ✅ Error handling scenarios
- ✅ Audit log creation
- ✅ Low stock detection
- ✅ Edge cases and boundary conditions


## 🌍 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `3000` | ❌ |
| `MONGODB_URI` | MongoDB connection string | - | ✅ |
| `NODE_ENV` | Environment stage | `development` | ❌ |

### Environment Setup Example

```bash
# .env file
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db?retryWrites=true&w=majority
NODE_ENV=development
```

## 🔒 Security Features

- **Input Validation**: Comprehensive validation on all endpoints using express-validator
- **MongoDB Injection Prevention**: Sanitized queries and parameterized operations
- **Error Message Sanitization**: Secure error responses without sensitive information
- **Data Type Validation**: Strong typing with TypeScript and runtime validation
- **CORS Configuration**: Cross-origin resource sharing properly configured
- **Rate Limiting**: Ready for implementation (recommended for production)

### Security Best Practices Implemented

✅ Input sanitization and validation  
✅ Error handling without information leakage  
✅ Secure MongoDB queries  
✅ Environment variable protection  
✅ TypeScript for compile-time safety  

