# 🌍 Earthquake Analytics API

A comprehensive RESTful API built using **Node.js**, **Express.js**, and **MongoDB** for managing, analyzing, and monitoring global earthquake data. Supports advanced filtering, sorting, pagination, full-text search, analytics with aggregation pipelines, JWT authentication, and RBAC.

---

## 🚀 Features

- ✅ **Full CRUD** – Create, Read, Update, Delete earthquake records
- ✅ **Bulk Operations** – Bulk Create / Update / Delete
- ✅ **Advanced Filtering** – By country, place, magnitude, depth, status, network, magType
- ✅ **Sorting** – By any field (magnitude, depth, time, gap, rms, etc.)
- ✅ **Pagination** – Page/limit on every list endpoint
- ✅ **Full-Text Search** – Keyword search across multiple fields
- ✅ **Analytics** – MongoDB aggregation pipelines for country, network, magnitude, depth, monthly analysis
- ✅ **Statistics** – Count, averages, distributions
- ✅ **JWT Authentication** – Register, login, access/refresh token flow
- ✅ **RBAC** – Admin and user roles with protected routes
- ✅ **Rate Limiting** – Per-endpoint rate limiting
- ✅ **Request Validation** – Input validation with express-validator
- ✅ **Error Handling** – Global error handler with consistent responses
- ✅ **Soft Delete** – Records flagged as deleted, not permanently removed
- ✅ **Database Seeding** – Auto-seed from JSON dataset
- ✅ **HEAD & OPTIONS** – Full HTTP method support

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| express-rate-limit | API rate limiting |
| helmet | HTTP security headers |
| cors | Cross-origin resource sharing |
| morgan | HTTP request logging |
| dotenv | Environment variables |

---

## 📂 Dataset

**USGS Global Earthquake Dataset**

Dataset Link: https://drive.google.com/file/d/1-zEv7-1RRqpBuPSJ2812MILuELv9KHKx/view

Supported Formats:
- USGS GeoJSON FeatureCollection
- Flat JSON array (CSV-converted)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd global_earthquakes_arpan_shah
```

### 2. Install Dependencies

```bash
cd Backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside `Backend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/earthquake_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=development
```

### 4. Add Dataset

Download the dataset and place it at:
```
Backend/data/earthquakes.json
```

### 5. Seed the Database

```bash
npm run seed
```

### 6. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

## 📂 Folder Structure

```
Backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   ├── earthquake.controller.js # CRUD + info + sort + random
│   ├── analytics.controller.js  # Aggregation analytics
│   ├── stats.controller.js      # Statistics endpoints
│   ├── search.controller.js     # Keyword search
│   ├── auth.controller.js       # Auth operations
│   └── jwt.controller.js        # JWT token operations
├── middlewares/
│   ├── auth.middleware.js       # JWT verification
│   ├── admin.middleware.js      # Admin/RBAC
│   ├── logger.middleware.js     # Request logging
│   ├── rateLimiter.middleware.js# Rate limiting
│   ├── errorHandler.middleware.js # Global error handler
│   ├── requestTime.middleware.js # Response time tracking
│   └── validate.middleware.js   # Input validation
├── models/
│   ├── Earthquake.model.js      # Earthquake schema
│   └── User.model.js            # User schema
├── routes/
│   ├── earthquake.routes.js     # /earthquakes
│   ├── analytics.routes.js      # /analytics/earthquakes
│   ├── stats.routes.js          # /stats/earthquakes
│   ├── search.routes.js         # /search
│   ├── filter.routes.js         # /earthquakes/filter
│   ├── auth.routes.js           # /auth
│   ├── jwt.routes.js            # /jwt
│   ├── admin.routes.js          # /admin
│   ├── protected.routes.js      # /protected
│   └── middleware.routes.js     # /middleware
├── services/
│   ├── earthquake.service.js    # Earthquake business logic
│   ├── analytics.service.js     # Analytics aggregation logic
│   ├── stats.service.js         # Stats aggregation logic
│   └── auth.service.js          # Auth business logic
├── utils/
│   ├── response.util.js         # Standardized API responses
│   ├── asyncHandler.util.js     # Centralized async wrapper
│   ├── pagination.util.js       # Reusable pagination
│   └── filterBuilder.util.js    # Dynamic filter builder
├── scripts/
│   └── seedData.js              # Database seeder
├── data/
│   └── earthquakes.json         # Dataset (add manually)
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── .gitignore
├── package.json
└── server.js                    # Entry point
```

---

## 🔑 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```
Returns `accessToken` and `refreshToken`.

### Use Protected Routes
```http
GET /auth/profile
Authorization: Bearer <accessToken>
```

---

## 📌 Key API Endpoints

| Category | Endpoint | Description |
|---|---|---|
| CRUD | `GET /earthquakes` | All records (with filter/sort/page) |
| CRUD | `GET /earthquakes/:id` | Single record by ID |
| CRUD | `POST /earthquakes` | Create record |
| CRUD | `PUT /earthquakes/:id` | Replace record |
| CRUD | `PATCH /earthquakes/:id` | Update record |
| CRUD | `DELETE /earthquakes/:id` | Soft delete |
| Info | `GET /earthquakes/high-magnitude` | Mag ≥ 6.0 |
| Info | `GET /earthquakes/deep` | Depth ≥ 300km |
| Info | `GET /earthquakes/critical` | Mag ≥ 7.0 + shallow |
| Filter | `GET /earthquakes?country=Japan&sort=magnitude&page=1&limit=10` | Combined |
| Analytics | `GET /analytics/earthquakes/country-analysis` | Country distribution |
| Analytics | `GET /analytics/earthquakes/magnitude-analysis` | Magnitude buckets |
| Stats | `GET /stats/earthquakes/count` | Total count |
| Search | `GET /search/earthquakes?q=japan` | Keyword search |
| Auth | `POST /auth/login` | Login |
| JWT | `POST /jwt/generate-token` | Generate token |
| Admin | `GET /admin/earthquakes` | Admin-only |
| Health | `GET /earthquakes/system/health` | API health |

---

## 🏗️ Architecture

- **MVC Pattern**: Models → Services → Controllers → Routes
- **Soft Delete**: `isDeleted` flag instead of permanent removal
- **Pagination**: Reusable utility across all list endpoints
- **Dynamic Filters**: Query params automatically converted to MongoDB filters
- **Aggregation**: Bucket, group, project stages for analytics

---

## 📝 License

ISC