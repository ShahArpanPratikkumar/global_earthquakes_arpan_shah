/**
 * @file response.util.js
 * @description Standardized API success and error response formatters.
 * @module utils/response
 */

/**
 * Standardized API Response Utility
 * Ensures consistent response format across all endpoints
 */

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

const sendCreated = (res, data = null, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

const sendError = (res, message = 'Something went wrong', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message,
  };
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }
  return res.status(statusCode).json(response);
};

const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

const sendBadRequest = (res, message = 'Bad request', error = null) => {
  return sendError(res, message, 400, error);
};

const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return sendError(res, message, 401);
};

const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, message, 403);
};

const sendValidationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
};

const sendPaginated = (res, data, total, page, limit, message = 'Data fetched successfully') => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = {
  sendSuccess,
  sendCreated,
  sendError,
  sendNotFound,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendValidationError,
  sendPaginated,
};