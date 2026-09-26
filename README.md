# Webiators Product Management

## Overview

A full-stack product management application built with the MERN stack (MongoDB, Express, React, Node.js). This application will provide secure user authentication and complete product management capabilities.

## Current Status

Backend foundation, MongoDB database connection, JWT user authentication, and Product CRUD are implemented. Frontend is not yet implemented.

## Tech Stack

**Backend (implemented)**
- Node.js
- Express.js
- dotenv
- CORS
- Helmet
- Nodemon (dev)
- MongoDB (database)
- Mongoose (MongoDB interaction)

- bcryptjs (password hashing)
- JSON Web Tokens (JWT)
- Product CRUD

**Backend (planned)**
- Backend validation + security

**Frontend (planned)**
- React (Vite)
- React Router
- Axios
- Material UI (MUI)
- CKEditor 5

## Project Structure

```
webiators-product-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
├── docs/
│   └── screenshots/
├── README.md
├── .gitignore
└── .env.example
```

## Prerequisites

- Node.js >= 18
- npm >= 9

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd webiators-product-management

# Install backend dependencies
cd backend
npm install
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in the required values:

```
PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

`MONGO_URI` must be a valid MongoDB Atlas connection string. The application connects to MongoDB before starting Express. Never commit real credentials.

## Running the Backend

```bash
cd backend
npm run dev
```

## API Endpoints

### Health Check

```
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "API is running"
}
```

### Authentication

Passwords are hashed with bcrypt. Authentication uses JWT (Bearer token, 7-day expiry).

```
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me        (protected — requires Authorization: Bearer <token>)
```

Signup response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "user": { "id": "...", "username": "..." } }
}
```

Login response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "...", "user": { "id": "...", "username": "..." } }
}
```

### Products

All product endpoints require `Authorization: Bearer <token>`.

```
POST   /api/products
GET    /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

Create product body:

```json
{
  "metaTitle": "Premium T-Shirt",
  "productName": "Premium Cotton T-Shirt",
  "productSlug": "premium-cotton-t-shirt",
  "galleryImages": ["https://example.com/image-1.jpg"],
  "price": 999,
  "discountedPrice": 799,
  "description": "<p>Premium cotton t-shirt.</p>"
}
```

## Git Commit Convention

This project follows conventional commits:

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance / setup
- `docs:` — documentation changes
- `refactor:` — code refactoring
- `test:` — adding or updating tests
