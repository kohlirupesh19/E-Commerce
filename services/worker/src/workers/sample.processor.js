import { Worker } from 'bullmq';
import { redisConnection } from '../queue/redis.js';
import { sampleQueueName } from '../queue/queues.js';
import { env } from '../config/env.js';

export const sampleWorker = new Worker(
  sampleQueueName,
  async (job) => {
    console.info('[worker][sample] processing', {
      id: job.id,
      name: job.name,
      payloadKeyCount: Object.keys(job.data || {}).length
    });

    return {
      processedAt: new Date().toISOString(),
      accepted: true
    };
  },
  {
    connection: redisConnection,
    concurrency: env.WORKER_CONCURRENCY,
    prefix: env.WORKER_QUEUE_PREFIX
  }
);

sampleWorker.on('completed', (job, result) => {
  console.info('[worker][sample] completed', {
    id: job.id,
    result
  });
});

sampleWorker.on('failed', (job, error) => {
  console.error('[worker][sample] failed', {
    id: job?.id,
    message: error.message
  });
});

sampleWorker.on('error', (error) => {
  console.error('[worker][sample] worker-error', {
    message: error.message
  });
});
