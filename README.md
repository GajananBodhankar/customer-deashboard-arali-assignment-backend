# Customer Dashboard Backend

Backend API for a customer dashboard built with Node.js, Express, MongoDB, Mongoose, JWT authentication, and bcrypt password hashing.

## Features

- User registration with linked customer profile creation
- User login with JWT token generation
- Protected customer listing, update, and delete routes
- MongoDB transactions for create, update, and delete workflows
- Request validation and centralized application errors

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- dotenv
- CORS

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB connection string

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGOOSE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run The Server

For development with nodemon:

```bash
npm run start-dev
```

For production:

```bash
npm start
```

The server runs on `http://localhost:3000` by default.

## API Endpoints

Base path: `/customer`

| Method | Endpoint | Auth Required | Description |
| --- | --- | --- | --- |
| POST | `/register` | No | Register a user and create a customer profile |
| POST | `/login` | No | Log in and receive a JWT token |
| GET | `/` | Yes | Get all customers |
| PUT | `/:id` | Yes | Update the authenticated user's customer data |
| DELETE | `/:id` | Yes | Delete the authenticated user's customer and user account |

Protected routes require an authorization header:

```http
Authorization: Bearer <token>
```

## Example Requests

### Register

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

### Login

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Project Structure

```text
.
|-- db/
|   `-- dbConnection.js
|-- Error/
|   `-- AppError.js
|-- Middleware/
|   `-- auth.js
|-- Model/
|   |-- customerModel.js
|   `-- userModel.js
|-- Routes/
|   `-- customer.route.js
|-- Service/
|   |-- customerservice.js
|   `-- userservice.js
|-- validation/
|   `-- validation.js
|-- index.js
|-- package.json
`-- README.md
```

## Scripts

```bash
npm start
npm run start-dev
```
