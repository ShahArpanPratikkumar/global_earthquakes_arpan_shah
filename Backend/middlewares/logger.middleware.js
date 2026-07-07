const fs = require('fs');
const path = require('path');

/**
 * Request Logger Middleware
 * Logs every incoming request with method, URL, status, and duration
 */
const logger = (req, res, next) => {
  const start = Date.now();

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms) | IP: ${req.ip}`;

    if (res.statusCode >= 500) {
      console.error(`🔴 ${log}`);
    } else if (res.statusCode >= 400) {
      console.warn(`🟡 ${log}`);
    } else {
      console.log(`🟢 ${log}`);
    }

    try {
      const logFilePath = path.join(__dirname, '../requests.log');
      fs.appendFileSync(logFilePath, log + '\n', 'utf8');
    } catch (err) {
      // Ignore log write errors to avoid crashing app
    }
  });

  next();
};

module.exports = logger;

