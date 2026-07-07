# global_earthquakes_arpan_shah
# 🌍 Earthquake Analytics API

A comprehensive RESTful API built using **Node.js**, **Express.js**, and **MongoDB** for managing, analyzing, and monitoring earthquake data. The API supports advanced filtering, sorting, pagination, analytics, authentication, and secure access using JWT.

## 🚀 Features

- CRUD Operations for Earthquake Records
- Bulk Create, Update & Delete
- Advanced Filtering & Search
- Pagination & Sorting
- Earthquake Analytics & Statistics
- JWT Authentication & Authorization
- Protected Admin Routes
- Request Validation
- Error Handling Middleware
- Rate Limiting & Security
- Country, Location & Magnitude-Based Analysis

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Express Validator
- Express Rate Limit
- bcrypt.js
- dotenv

## 📂 Dataset

USGS Earthquake Dataset

Dataset Link:
https://drive.google.com/file/d/1-zEv7-1RRqpBuPSJ2812MILuELv9KHKx/view

## 📌 API Capabilities

### Earthquake Management
- Create Earthquake Records
- Update Existing Records
- Delete Records
- Fetch Single/Multiple Records

### Advanced Query Features
- Filter by Country
- Filter by Magnitude
- Filter by Depth
- Filter by Status
- Filter by Seismic Network
- Search by Keywords
- Sorting & Pagination

### Analytics
- Highest Magnitude Earthquakes
- Deepest Earthquakes
- Monthly Trends
- Country-wise Distribution
- Magnitude Analysis
- Depth Analysis
- Recent Seismic Activity

### Statistics
- Total Earthquake Count
- Average Magnitude
- Average Depth
- Country Statistics
- Network Statistics
- Reviewed Records Count

### Security
- JWT Authentication
- Protected Routes
- Role-Based Access Control
- Password Encryption
- Rate Limiting

## ⚙️ Installation

```bash
git clone <repository-url>

cd earthquake-analytics-api

npm install

---

## Project Architecture

```
global_earthquakes_arpan_shah/
├── Backend/                  # Node.js + Express REST API
│   ├── config/               # DB connection, auto-seeding
│   ├── constants/            # HTTP codes, messages, limits
│   ├── controllers/          # Route request handlers
│   ├── middlewares/          # Auth, logging, validation, rate-limiting
│   ├── models/               # Mongoose schemas (User, Earthquake)
│   ├── routes/               # Express routers
│   ├── scripts/              # Admin and seeding scripts
│   ├── services/             # Business logic layer
│   └── utils/                # Helper functions
└── Frontend/                 # React 18 + Vite + Redux Toolkit
    └── src/
        ├── components/       # Reusable UI components
        │   ├── charts/       # Recharts visualizations
        │   ├── forms/        # Form components
        │   ├── layout/       # Layout (Navbar, Sidebar, Footer)
        │   ├── tables/       # Data tables
        │   └── ui/           # Generic UI primitives
        ├── constants/        # App-wide constant definitions
        ├── hooks/            # Custom React hooks
        ├── pages/            # Page-level route components
        ├── routes/           # Route configuration
        ├── services/         # Axios API service layer
        ├── store/            # Redux Toolkit store and slices
        └── utils/            # Client-side utility functions
```

## Quick Start

```bash
# Backend
cd Backend && cp .env.example .env && npm install && npm run dev

# Frontend
cd Frontend && cp .env.example .env && npm install && npm run dev
```

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Vite, Redux Toolkit, Tailwind CSS, Recharts |
| Backend    | Node.js, Express, MongoDB, Mongoose |
| Auth       | JWT (JSON Web Tokens), bcrypt |
| API Client | Axios with interceptors |
