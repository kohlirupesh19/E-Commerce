import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  REDIS_URL: z.string().min(1),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  WORKER_QUEUE_PREFIX: z.string().min(1).default('obsidian-curator')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid worker environment configuration:\n${issues}`);
}

export const env = Object.freeze(parsed.data);
