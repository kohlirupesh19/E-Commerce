import { sampleQueue } from '../queue/queues.js';
import { redisConnection } from '../queue/redis.js';

async function main() {
  try {
    const job = await sampleQueue.add('phase0-smoke-check', {
      source: 'manual-trigger',
      createdAt: new Date().toISOString()
    });

    console.info('[worker][sample] enqueued', {
      id: job.id,
      queue: job.queueName
    });
  } finally {
    await sampleQueue.close();
    await redisConnection.quit();
  }
}

main().catch((error) => {
  console.error('[worker][sample] enqueue error', error);
  process.exit(1);
});
