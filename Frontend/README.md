# 🌍 Global Earthquake Analytics Dashboard (Frontend)

A modern, NASA/USGS-inspired earthquake monitoring and analytics dashboard built using React (Vite), Tailwind CSS, Redux Toolkit, Axios, Recharts, and Framer Motion. Connects to the running backend API at `http://localhost:5000`.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (with async thunks for API data-fetching)
- **Routing**: React Router DOM (v6, with Protected Routes and lazy loading)
- **Charts & Graphs**: Recharts (fully responsive, animated)
- **Animations**: Framer Motion
- **Form Validation**: Formik & Yup
- **Toast Alerts**: React Toastify
- **SEO/Helmet**: React Helmet Async

---

## 📂 Project Structure

```
Frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/       # Sidebar, Navbar, Layout wrapper
│   │   ├── ui/           # Cards, Badges, Skeletons
│   │   ├── charts/       # Country Bar Chart, Network Doughnut Chart, Trend Line Chart
│   │   └── tables/       # Paginated, sorted, filterable Earthquake Table
│   │   └── forms/        # Login and Register forms (Formik + Yup)
│   ├── pages/
│   │   ├── auth/         # Login & Register pages
│   │   ├── dashboard/    # Real-time stats counters and recent logs
│   │   ├── earthquakes/  # Full-screen tabular register
│   │   ├── analytics/    # Recharts metrics dashboard
│   │   ├── earthquake-details/ # Specification sheet, regional events
│   │   ├── profile/      # Operator credentials summary
│   │   └── settings/     # Visual theme triggers (light/dark)
│   ├── services/         # Central Axios config and auth/earthquake services
│   ├── store/            # Redux store & slices (auth, earthquakes, analytics, ui)
│   ├── routes/           # AppRoutes and ProtectedRoute configurations
│   ├── utils/            # Shared styles, validation schemas
│   ├── App.jsx           # Main provider registry
│   ├── main.jsx          # Mount wrapper
│   └── index.css         # Tailwind & custom scrollbar styles
├── index.html
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Setup & Execution

### 1. Prerequisite
Ensure the Backend server is running at `http://localhost:5000`. (If it isn't running, go to the `Backend` directory and execute `npm run dev`).

### 2. Install Dependencies
All dependencies are already configured in `package.json`. If you need to re-run installation:
```bash
npm install
```

### 3. Run Development Server
To launch the Vite development server on port `3000`:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

---

## 🔑 Authentication Access
The backend expects JWT tokens. If you do not have an operator account:
1. Go to the **Register** page on the portal (`http://localhost:3000/register`).
2. Create an account with your Name, Email, and Password.
3. You will be redirected to the **Login** page to access the secure portal.


## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:5000/api
```

## Tech Stack

- **React 18** + **Vite** - Fast development and build
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Recharts** - Data visualization charts
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors
