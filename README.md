# Webiators Product Management

## Overview

A full-stack product management application built with the MERN stack (MongoDB, Express, React, Node.js). This application will provide secure user authentication and complete product management capabilities.

## Current Status

Backend foundation is set up. MongoDB, authentication, and product functionality are not yet implemented.

## Tech Stack

**Backend (implemented)**
- Node.js
- Express.js
- dotenv
- CORS
- Helmet
- Nodemon (dev)

**Backend (planned)**
- MongoDB + Mongoose
- JSON Web Tokens (JWT)

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

## Git Commit Convention

This project follows conventional commits:

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance / setup
- `docs:` — documentation changes
- `refactor:` — code refactoring
- `test:` — adding or updating tests
