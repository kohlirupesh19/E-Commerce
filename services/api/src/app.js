import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { requestLoggerMiddleware } from './middleware/request-logger.js';
import { notFoundHandler, errorHandler } from './middleware/error-handler.js';
import { v1Router } from './routes/v1/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiFilePath = path.resolve(__dirname, '../openapi/openapi.yaml');

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

app.get('/health', (_req, res) => {
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

app.get('/openapi.yaml', async (_req, res, next) => {
  try {
    const spec = await fs.readFile(openApiFilePath, 'utf-8');
    res.setHeader('content-type', 'application/yaml');
    return res.status(200).send(spec);
  } catch (error) {
    return next(error);
  }
});

app.use('/api/v1', v1Router);

app.use(notFoundHandler);
app.use(errorHandler);
