import { redisConnection } from './queue/redis.js';
import { sampleQueue } from './queue/queues.js';
import { sampleWorker } from './workers/sample.processor.js';

console.info('[worker] started and awaiting jobs');

let isShuttingDown = false;

async function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info(`[worker] received ${signal}, shutting down`);

  try {
    await sampleWorker.close();
    await sampleQueue.close();
    await redisConnection.quit();
    process.exit(0);
  } catch (error) {
    console.error('[worker] shutdown error', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});
