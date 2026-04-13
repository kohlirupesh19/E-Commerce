import { ZodError } from 'zod';

export function notFoundHandler(_req, res) {
  return res.status(404).json({
    success: false,
    data: null,
    error: 'Route not found'
  });
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Validation failed',
      details: err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message
      }))
    });
  }

  if (err?.code === 'P2002') {
    return res.status(409).json({
      success: false,
      data: null,
      error: 'A unique constraint was violated.'
    });
  }

  const status = Number.isInteger(err?.status) ? err.status : 500;

  if (process.env.NODE_ENV !== 'test') {
    console.error('[api][error]', {
      requestId: req.requestId,
      status,
      message: err?.message || 'Unexpected error'
    });
  }

  return res.status(status).json({
    success: false,
    data: null,
    error: status >= 500 ? 'Internal server error' : err?.message || 'Request failed'
  });
}
