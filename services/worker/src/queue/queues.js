import { Queue } from 'bullmq';
import { redisConnection } from './redis.js';
import { env } from '../config/env.js';

export const sampleQueueName = 'sample.jobs';

export const sampleQueue = new Queue(sampleQueueName, {
  connection: redisConnection,
  prefix: env.WORKER_QUEUE_PREFIX,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: 100,
    removeOnFail: 200,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});
