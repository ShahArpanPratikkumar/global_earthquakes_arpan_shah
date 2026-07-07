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


