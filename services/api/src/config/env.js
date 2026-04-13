import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const placeholderPattern = /(replace_me|changeme|example|dummy|your_)/i;

function assertStrongSecret(secretName, secretValue, nodeEnv) {
  if (nodeEnv !== 'production') {
    return;
  }

  if (placeholderPattern.test(secretValue)) {
    throw new Error(`${secretName} must not be a placeholder value in production`);
  }

  if (secretValue.length < 32) {
    throw new Error(`${secretName} must be at least 32 characters in production`);
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(4000),
  API_HOST: z.string().min(1).default('0.0.0.0'),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().min(2).default('15m'),
  JWT_REFRESH_TTL: z.string().min(2).default('7d'),
  CHECKOUT_TAX_RATE: z.coerce.number().min(0).max(1).default(0.08),
  CHECKOUT_DEFAULT_SHIPPING: z.coerce.number().min(0).default(0),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid API environment configuration:\n${issues}`);
}

assertStrongSecret('JWT_ACCESS_SECRET', parsed.data.JWT_ACCESS_SECRET, parsed.data.NODE_ENV);
assertStrongSecret('JWT_REFRESH_SECRET', parsed.data.JWT_REFRESH_SECRET, parsed.data.NODE_ENV);

if (parsed.data.NODE_ENV === 'production') {
  if (placeholderPattern.test(parsed.data.STRIPE_SECRET_KEY)) {
    throw new Error('STRIPE_SECRET_KEY must not be a placeholder value in production');
  }

  if (!parsed.data.STRIPE_SECRET_KEY.startsWith('sk_live_') || parsed.data.STRIPE_SECRET_KEY.length < 24) {
    throw new Error('STRIPE_SECRET_KEY must be a live Stripe key in production');
  }

  if (placeholderPattern.test(parsed.data.STRIPE_WEBHOOK_SECRET)) {
    throw new Error('STRIPE_WEBHOOK_SECRET must not be a placeholder value in production');
  }

  if (!parsed.data.STRIPE_WEBHOOK_SECRET.startsWith('whsec_') || parsed.data.STRIPE_WEBHOOK_SECRET.length < 24) {
    throw new Error('STRIPE_WEBHOOK_SECRET must be a valid Stripe webhook secret in production');
  }
}

export const env = Object.freeze(parsed.data);
