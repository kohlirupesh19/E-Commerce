export function requestLoggerMiddleware(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    if (process.env.NODE_ENV !== 'test') {
      console.info('[api][request]', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        queryKeyCount: Object.keys(req.query || {}).length,
        statusCode: res.statusCode,
        aborted: false,
        completed: true,
        durationMs
      });
    }
  });

  req.on('close', () => {
    if (res.writableEnded) {
      return;
    }

    const durationMs = Date.now() - startedAt;
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[api][request-aborted]', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        queryKeyCount: Object.keys(req.query || {}).length,
        statusCode: res.statusCode,
        aborted: true,
        completed: false,
        durationMs
      });
    }
  });

  next();
}
