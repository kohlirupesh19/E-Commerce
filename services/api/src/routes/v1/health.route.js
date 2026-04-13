import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString()
    },
    error: null
  });
});
