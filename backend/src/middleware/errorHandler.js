export function notFoundHandler(request, response) {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`
  });
}

export function errorHandler(error, request, response, next) {
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  response.status(status).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(error.details ? { details: error.details } : {})
  });
}