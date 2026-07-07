/**
 * Request Time Middleware
 * Attaches request start time and logs duration
 */
const requestTime = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  req.requestTime = new Date().toISOString();

  // Single listener — measure and log duration on response finish
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    console.log(`⏱  Request Time: ${req.method} ${req.originalUrl} → ${durationMs.toFixed(2)}ms`);
  });

  next();
};

module.exports = requestTime;
