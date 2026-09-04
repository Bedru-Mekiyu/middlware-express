# Express.js Authentication & User Management API

A secure RESTful API backend built with Express.js, MongoDB, and Mongoose, implementing token-based authentication (JWT access and refresh tokens), CSRF protection, request rate limiting, input validation, and structured error handling.

---

## Key Features

- **JWT Authentication**: Short-lived access tokens and httpOnly cookie-stored refresh tokens.
- **CSRF Protection**: Token-based CSRF protection using `csurf` with cookie storage.
- **Security Middleware**:
  - **Helmet**: Secure HTTP header configuration.
  - **Express Mongo Sanitize**: Prevents NoSQL query injection attacks.
  - **XSS Clean**: Sanitizes user input against cross-site scripting attacks.
  - **HPP**: HTTP Parameter Pollution protection.
  - **Express Rate Limit**: Prevents brute-force and abuse on API endpoints.
- **Input Validation**: Request validation using `express-validator`.
- **Structured Logging**: Application logging powered by `winston` and request logging via `morgan`.
- **Centralized Error Handling**: Custom `AppError` class and global error middleware.

---

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5)
- **Database**: MongoDB / Mongoose ODM
- **Authentication**: `jsonwebtoken`, `bcryptjs`, `cookie-parser`
- **Security**: `helmet`, `express-rate-limit`, `csurf`, `express-mongo-sanitize`, `xss-clean`, `hpp`
- **Logging**: `winston`, `morgan`

---

## Project Structure

```text
.
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore configuration
├── app.js                    # Express application configuration & middleware setup
├── server.js                 # HTTP server entry point & DB connection initialization
├── package.json              # Dependencies and scripts
├── package-lock.json         # Dependency lockfile
└── src/
    ├── config/
    │   ├── db.js             # Mongoose database connection setup
    │   └── logger.js         # Winston logger configuration
    ├── controllers/
    │   ├── authController.js # Auth handlers (register, login, logout, refresh)
    │   └── userController.js # User handlers (getUsers, getUserById)
    ├── middlewares/
    │   ├── asyncHandler.js   # Wrapper for async express route handlers
    │   ├── authMiddleware.js # JWT authentication & role authorization
    │   ├── errorHandler.js # Global central error handler
    │   └── validate.js     # express-validator error formatter
    ├── models/
    │   └── user.js           # User schema & password hashing hooks
    ├── routes/
    │   ├── authRoutes.js     # Auth endpoint definitions
    │   └── userRoutes.js     # User endpoint definitions
    ├── utils/
    │   └── AppError.js       # Custom operational error class
    └── validators/
        └── authValidator.js  # Registration and login validation schemas
```

---

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB instance (local or MongoDB Atlas connection string)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```

   **Environment Variables Reference:**
   | Variable | Description | Default / Example |
   | --- | --- | --- |
   | `PORT` | Server listening port | `5000` |
   | `NODE_ENV` | Environment stage (`development` or `production`) | `development` |
   | `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/express-auth` |
   | `JWT_ACCESS_SECRET` | Secret key for signing access tokens | `your_access_secret` |
   | `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | `your_refresh_secret` |
   | `JWT_ACCESS_EXPIRES` | Access token lifespan | `15m` |
   | `JWT_REFRESH_EXPIRES` | Refresh token lifespan | `7d` |
   | `COOKIE_EXPIRES_IN` | Cookie expiration time in days | `7` |

### Running Locally

- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

---

## API Documentation

### Authentication Endpoints

- **`GET /api/v1/csrf-token`**
  - **Description**: Fetch CSRF token for web clients.
  - **Response**: `{ "csrfToken": "<token>" }`

- **`POST /api/v1/auth/register`**
  - **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "role": "user" }`
  - **Response**: `{ "status": "success", "accessToken": "<jwt-token>" }`

- **`POST /api/v1/auth/login`**
  - **Body**: `{ "email": "john@example.com", "password": "password123" }`
  - **Response**: `{ "status": "success", "accessToken": "<jwt-token>" }`
  - **Sets Cookie**: `refreshToken` (httpOnly)

- **`POST /api/v1/auth/refresh`**
  - **Requires**: `refreshToken` cookie
  - **Response**: `{ "status": "success", "accessToken": "<new-jwt-token>" }`

- **`POST /api/v1/auth/logout`**
  - **Requires**: `refreshToken` cookie
  - **Response**: `{ "status": "success", "message": "Logged out successfully" }`

### User Endpoints (Protected)

- **`GET /api/v1/users`**
  - **Header**: `Authorization: Bearer <accessToken>`
  - **Access**: Restricted to `admin` role.

- **`GET /api/v1/users/:id`**
  - **Header**: `Authorization: Bearer <accessToken>`
  - **Access**: Authenticated users.

---

## Continuous Integration

Automated testing and lint/build verification runs via GitHub Actions on every push and pull request to `main` / `master`.

To run the verification suite locally:
```bash
npm test
```
