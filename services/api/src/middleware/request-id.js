import crypto from 'node:crypto';

export function requestIdMiddleware(req, res, next) {
  const incomingRequestId = req.headers['x-request-id'];
  const requestId = typeof incomingRequestId === 'string' && incomingRequestId.trim().length > 0
    ? incomingRequestId
    : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
}
