import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(env.API_PORT, env.API_HOST, () => {
  console.info(`[api] listening on http://${env.API_HOST}:${env.API_PORT}`);
});

async function shutdown(signal) {
  console.info(`[api] received ${signal}, shutting down`);
  server.close(async (error) => {
    if (error) {
      console.error('[api] shutdown error', error);
      process.exit(1);
    }
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});
