# Webiators Product Management

> Project initialization is in progress.

## Overview

A full-stack product management application built with the MERN stack (MongoDB, Express, React, Node.js). This application provides secure user authentication and complete product management capabilities.

## Features

- User authentication (signup / login)
- JWT-based session management
- Product CRUD operations
- Rich text description editor (CKEditor)
- Product image slider
- Form validation
- Protected routes

## Tech Stack

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Helmet

**Frontend**
- React (Vite)
- React Router
- Axios
- Material UI (MUI)
- CKEditor 5

## Project Structure

```
webiators-product-management/
├── backend/
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
- MongoDB (local or Atlas)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd webiators-product-management

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=<your-frontend-url>
```

## Running the Project

```bash
# Start backend
cd backend
npm run dev

# Start frontend (separate terminal)
cd frontend
npm run dev
```

## Authentication

Details to be documented after implementation.

## Product Management

Details to be documented after implementation.

## Validation

Details to be documented after implementation.

## Security

Details to be documented after implementation.

## Testing

Details to be documented after implementation.

## Screenshots

Screenshots will be added after the frontend is completed.

## Git Commit Convention

This project follows conventional commits:

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance / setup
- `docs:` — documentation changes
- `refactor:` — code refactoring
- `test:` — adding or updating tests
