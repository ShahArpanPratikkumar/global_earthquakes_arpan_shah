require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const logger = require('./middlewares/logger.middleware');
const requestTime = require('./middlewares/requestTime.middleware');
const { errorHandler, notFound } = require('./middlewares/errorHandler.middleware');

// Route imports
const earthquakeRoutes = require('./routes/earthquake.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const statsRoutes = require('./routes/stats.routes');
const searchRoutes = require('./routes/search.routes');
const authRoutes = require('./routes/auth.routes');
const jwtRoutes = require('./routes/jwt.routes');
const adminRoutes = require('./routes/admin.routes');
const protectedRoutes = require('./routes/protected.routes');
const middlewareRoutes = require('./routes/middleware.routes');

// Connect to MongoDB
connectDB();

const app = express();

// Serve local generated images from artifacts folder
app.use('/local-images', express.static('C:/Users/shahp/.gemini/antigravity-ide/brain/d017d907-07ab-41e9-a645-38238061593f'));

// ─── SECURITY MIDDLEWARE ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── BODY PARSING ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── LOGGING MIDDLEWARE ───────────────────────────────────────────────────────
app.use(requestTime);  // Attach request time
app.use(logger);       // Custom colored logger

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Morgan for detailed dev logging
}

// ─── ROOT ROUTE ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌍 Earthquake Analytics API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    documentation: 'https://github.com/your-repo/earthquake-api',
    endpoints: {
      earthquakes: '/earthquakes',
      analytics: '/analytics/earthquakes',
      stats: '/stats/earthquakes',
      search: '/search/earthquakes',
      auth: '/auth',
      jwt: '/jwt',
      admin: '/admin',
      protected: '/protected',
      middleware: '/middleware',
      health: '/earthquakes/system/health',
    },
  });
});

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/earthquakes', earthquakeRoutes);
app.use('/analytics/earthquakes', analyticsRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/stats/earthquakes', statsRoutes);
app.use('/search', searchRoutes);
app.use('/auth', authRoutes);
app.use('/jwt', jwtRoutes);
app.use('/admin', adminRoutes);
app.use('/protected', protectedRoutes);
app.use('/middleware', middlewareRoutes);

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────
app.use(notFound);       // 404 handler for unknown routes
app.use(errorHandler);   // Global error handler

// ─── START SERVER ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`   Earthquake Analytics API`);
  console.log(`   Running on port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log('================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err.message);
  server.close(() => process.exit(1));
});

// Handle SIGTERM (graceful shutdown)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
