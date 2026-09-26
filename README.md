# Webiators Product Management

## Overview

A full-stack product management application built with the MERN stack (MongoDB, Express, React, Node.js). This application will provide secure user authentication and complete product management capabilities.

## Current Status

Backend and frontend are fully implemented. Backend covers Express, MongoDB/Mongoose, JWT authentication, Product CRUD, Joi validation, Helmet, CORS, and centralized error handling. Frontend covers authentication (signup, login, logout, protected routes, JWT persistence) and full product management (list, add, edit, delete, detail).

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
- Joi (request validation)
- Centralized error handling
- Helmet (security headers)
- CORS (restricted to CLIENT_URL)

**Backend (planned)**
- *(none — fully implemented)*

**Frontend (implemented)**
- React (Vite)
- React Router
- Axios (with JWT interceptor)
- Material UI (MUI)
- MUI Icons
- Authentication (signup, login, logout)
- JWT storage and persistence
- Protected routes
- Auth context
- Product listing
- Add product
- Edit product
- Delete product (with confirmation)
- Product detail with image gallery
- Clickable image thumbnails
- Previous/Next image navigation
- Image fallback handling
- Client-side form validation
- CKEditor 5 rich-text description editor
- Sanitized HTML rendering on Product Detail

**Frontend (planned)**
- Image slider on product detail

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
│   ├── src/
│   │   ├── components/   # Navbar, ProductForm, ConfirmDialog
│   │   ├── context/      # AuthContext
│   │   ├── layouts/      # AuthLayout, MainLayout
│   │   ├── pages/        # Login, Signup, Products, Add, Edit, Detail, NotFound
│   │   ├── routes/       # AppRoutes, ProtectedRoute
│   │   ├── services/     # api.js, authService.js, productService.js
│   │   ├── utils/        # auth.js (token helpers)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
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
# Install frontend dependencies
cd ../frontend
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

Copy `frontend/.env.example` to `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

`MONGO_URI` must be a valid MongoDB Atlas connection string. The application connects to MongoDB before starting Express. Never commit real credentials.

## Running the Backend

```bash
cd backend
npm run dev
```

## Running the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

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

Validation rules:
- `metaTitle` — required, max 100 chars
- `productName` — required, max 200 chars
- `productSlug` — required, URL-friendly format (e.g. `premium-cotton-t-shirt`)
- `galleryImages` — required array of valid URLs, min 1 item
- `price` — required positive number
- `discountedPrice` — optional positive number, must be less than price
- `description` — required string

Validation error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "productName", "message": "Product name is required" }
  ]
}
```

## Authentication

The frontend uses JWT-based authentication backed by the Express API.

- Signup creates an account and redirects to `/login`.
- Login stores the JWT in `localStorage` under the key `authToken` and redirects to `/products`.
- On every page load, `AuthContext` reads the stored token and calls `GET /api/auth/me` to restore the session.
- If the token is invalid or expired it is removed and the user is treated as unauthenticated.
- Logout removes the token, clears the user state, and redirects to `/login`.
- All product routes are protected — unauthenticated access redirects to `/login`.
- The Axios instance automatically attaches `Authorization: Bearer <token>` via a request interceptor.

## Product Management

| Feature | Route |
|---|---|
| Product list | `/products` |
| Add product | `/products/new` |
| Product detail | `/products/:id` |
| Edit product | `/products/:id/edit` |

- All product routes require authentication.
- The product list shows name, meta title, slug, price, discounted price, description preview, and the first gallery image.
- Add and Edit share a single `ProductForm` component with client-side validation.
- Delete shows a confirmation dialog before calling the API.
- Successful creation redirects to the new product's detail page.
- Successful edit redirects back to the product detail page.
- Client-side validation mirrors backend rules: required fields, slug format, URL format for images, price/discounted-price relationship.
- Backend validation errors are surfaced to the user in plain language.
- Product detail displays a main image with Previous/Next navigation controls.
- All gallery images are shown as clickable thumbnails; clicking a thumbnail makes it the main image.
- Missing or broken gallery images are handled gracefully with a placeholder.

## Git Commit Convention

This project follows conventional commits:

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance / setup
- `docs:` — documentation changes
- `refactor:` — code refactoring
- `test:` — adding or updating tests
