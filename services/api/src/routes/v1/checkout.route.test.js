import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.API_PORT = '4000';
process.env.API_HOST = '0.0.0.0';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/obsidian_curator';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_with_sufficient_length_123';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_with_sufficient_length_123';
process.env.JWT_ACCESS_TTL = '15m';
process.env.JWT_REFRESH_TTL = '7d';
process.env.CHECKOUT_TAX_RATE = '0.08';
process.env.CHECKOUT_DEFAULT_SHIPPING = '0';
process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';

const { app } = await import('../../app.js');
const { prisma } = await import('../../lib/prisma.js');

function createAccessToken(userId = 'user_test_1') {
  return jwt.sign(
    {
      sub: userId,
      email: 'buyer@example.com',
      name: 'Buyer Example',
      type: 'access'
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

function mockPrismaForAuth(userId = 'user_test_1') {
  return {
    userFindUnique: async () => ({
      id: userId,
      email: 'buyer@example.com',
      name: 'Buyer Example',
      isActive: true
    })
  };
}

test('checkout confirm rejects non-succeeded payment intent', async () => {
  const originalUserFindUnique = prisma.user.findUnique;
  const originalPaymentIntentFindFirst = prisma.paymentIntent.findFirst;

  prisma.user.findUnique = mockPrismaForAuth().userFindUnique;
  prisma.paymentIntent.findFirst = async () => ({
    id: 'pi_requires_confirmation',
    userId: 'user_test_1',
    status: 'REQUIRES_CONFIRMATION',
    shippingAmount: '0.00',
    amount: '10.80',
    subtotalAmount: '10.00',
    taxAmount: '0.80',
    currency: 'USD'
  });

  try {
    const response = await request(app)
      .post('/api/v1/checkout/confirm')
      .set('Authorization', `Bearer ${createAccessToken()}`)
      .send({ paymentIntentId: 'pi_requires_confirmation' });

    assert.equal(response.status, 409);
    assert.match(response.body.error, /Payment has not been verified/i);
  } finally {
    prisma.user.findUnique = originalUserFindUnique;
    prisma.paymentIntent.findFirst = originalPaymentIntentFindFirst;
  }
});

test('checkout confirm returns canonical order on idempotent unique conflict', async () => {
  const canonicalOrder = {
    id: 'order_123',
    status: 'PAID',
    subtotal: '10.00',
    taxAmount: '0.80',
    shippingAmount: '0.00',
    totalAmount: '10.80',
    currency: 'USD',
    items: [
      {
        id: 'order_item_1',
        productId: 'product_1',
        variantId: null,
        productName: 'Sample Product',
        sku: null,
        quantity: 1,
        unitPrice: '10.00',
        lineTotal: '10.00'
      }
    ]
  };

  const originalUserFindUnique = prisma.user.findUnique;
  const originalPaymentIntentFindFirst = prisma.paymentIntent.findFirst;
  const originalOrderFindUnique = prisma.order.findUnique;
  const originalCartFindUnique = prisma.cart.findUnique;
  const originalTransaction = prisma.$transaction;

  let orderLookupCount = 0;

  prisma.user.findUnique = mockPrismaForAuth().userFindUnique;
  prisma.paymentIntent.findFirst = async () => ({
    id: 'pi_succeeded_1',
    userId: 'user_test_1',
    status: 'SUCCEEDED',
    shippingAmount: '0.00',
    amount: '10.80',
    subtotalAmount: '10.00',
    taxAmount: '0.80',
    currency: 'USD'
  });
  prisma.order.findUnique = async () => {
    orderLookupCount += 1;
    return orderLookupCount === 1 ? null : canonicalOrder;
  };
  prisma.cart.findUnique = async () => ({
    id: 'cart_1',
    userId: 'user_test_1',
    items: [
      {
        id: 'cart_item_1',
        cartId: 'cart_1',
        productId: 'product_1',
        variantId: null,
        quantity: 1,
        unitPrice: '10.00',
        product: {
          id: 'product_1',
          name: 'Sample Product',
          slug: 'sample-product',
          status: 'PUBLISHED',
          _count: {
            variants: 0
          }
        },
        variant: null
      }
    ]
  });
  prisma.$transaction = async () => {
    const error = new Error('Unique conflict');
    error.code = 'P2002';
    throw error;
  };

  try {
    const response = await request(app)
      .post('/api/v1/checkout/confirm')
      .set('Authorization', `Bearer ${createAccessToken()}`)
      .send({ paymentIntentId: 'pi_succeeded_1' });

    assert.equal(response.status, 200);
    assert.equal(response.body.data.order.id, 'order_123');
    assert.equal(response.body.data.order.status, 'PAID');
  } finally {
    prisma.user.findUnique = originalUserFindUnique;
    prisma.paymentIntent.findFirst = originalPaymentIntentFindFirst;
    prisma.order.findUnique = originalOrderFindUnique;
    prisma.cart.findUnique = originalCartFindUnique;
    prisma.$transaction = originalTransaction;
  }
});

test('checkout intent returns canonical intent on unique conflict race', async () => {
  const canonicalIntent = {
    id: 'pi_canonical_1',
    userId: 'user_test_1',
    status: 'REQUIRES_CONFIRMATION',
    amount: '10.80',
    currency: 'USD',
    idempotencyKey: 'idem_checkout_123'
  };

  const originalUserFindUnique = prisma.user.findUnique;
  const originalCartFindUnique = prisma.cart.findUnique;
  const originalPaymentIntentFindUnique = prisma.paymentIntent.findUnique;
  const originalPaymentIntentCreate = prisma.paymentIntent.create;

  let findUniqueCount = 0;

  prisma.user.findUnique = mockPrismaForAuth().userFindUnique;
  prisma.cart.findUnique = async () => ({
    id: 'cart_1',
    userId: 'user_test_1',
    items: [
      {
        id: 'cart_item_1',
        cartId: 'cart_1',
        productId: 'product_1',
        variantId: null,
        quantity: 1,
        unitPrice: '10.00',
        product: {
          id: 'product_1',
          name: 'Sample Product',
          slug: 'sample-product',
          status: 'PUBLISHED',
          _count: {
            variants: 0
          }
        },
        variant: null
      }
    ]
  });
  prisma.paymentIntent.findUnique = async () => {
    findUniqueCount += 1;
    return findUniqueCount === 1 ? null : canonicalIntent;
  };
  prisma.paymentIntent.create = async () => {
    const error = new Error('Unique conflict');
    error.code = 'P2002';
    throw error;
  };

  try {
    const response = await request(app)
      .post('/api/v1/checkout/intent')
      .set('Authorization', `Bearer ${createAccessToken()}`)
      .send({ idempotencyKey: 'idem_checkout_123' });

    assert.equal(response.status, 200);
    assert.equal(response.body.data.id, 'pi_canonical_1');
    assert.equal(response.body.data.idempotencyKey, 'idem_checkout_123');
  } finally {
    prisma.user.findUnique = originalUserFindUnique;
    prisma.cart.findUnique = originalCartFindUnique;
    prisma.paymentIntent.findUnique = originalPaymentIntentFindUnique;
    prisma.paymentIntent.create = originalPaymentIntentCreate;
  }
});

test('checkout webhook updates payment intent status with valid signature', async () => {
  const originalUpdateMany = prisma.paymentIntent.updateMany;

  prisma.paymentIntent.updateMany = async () => ({ count: 1 });

  try {
    const response = await request(app)
      .post('/api/v1/webhooks/payments/stripe')
      .set('x-stripe-signature', 'whsec_dummy')
      .send({
        paymentIntentId: 'pi_webhook_1',
        status: 'succeeded',
        externalRef: 'evt_1'
      });

    assert.equal(response.status, 202);
    assert.equal(response.body.data.accepted, true);
    assert.equal(response.body.data.paymentIntentId, 'pi_webhook_1');
    assert.equal(response.body.data.status, 'SUCCEEDED');
  } finally {
    prisma.paymentIntent.updateMany = originalUpdateMany;
  }
});

test('checkout webhook rejects invalid signature', async () => {
  const originalUpdateMany = prisma.paymentIntent.updateMany;

  let updateCalled = false;
  prisma.paymentIntent.updateMany = async () => {
    updateCalled = true;
    return { count: 1 };
  };

  try {
    const response = await request(app)
      .post('/api/v1/webhooks/payments/stripe')
      .set('x-stripe-signature', 'wrong_signature')
      .send({
        paymentIntentId: 'pi_webhook_1',
        status: 'succeeded'
      });

    assert.equal(response.status, 401);
    assert.equal(updateCalled, false);
  } finally {
    prisma.paymentIntent.updateMany = originalUpdateMany;
  }
});
