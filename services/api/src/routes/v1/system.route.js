import { Router } from 'express';

export const systemRouter = Router();

systemRouter.get('/meta', (_req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      name: 'The Obsidian Curator API',
      version: '0.1.0',
      apiVersion: 'v1'
    },
    error: null
  });
});
