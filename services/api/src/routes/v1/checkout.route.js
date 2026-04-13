import crypto from 'node:crypto';
import { Router } from 'express';
import { OrderStatus, PaymentIntentStatus, ProductStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../../middleware/require-auth.js';
import { successResponse } from '../../utils/response.js';
import { HttpError } from '../../utils/http-error.js';
import { env } from '../../config/env.js';

const addCartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).optional(),
  quantity: z.coerce.number().int().positive().max(100).default(1)
});

const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive().max(100)
});

const quoteSchema = z.object({});

const checkoutIntentSchema = z.object({
  idempotencyKey: z.string().min(8).max(128).optional()
});

const checkoutConfirmSchema = z.object({
  paymentIntentId: z.string().min(1)
});

const paymentWebhookSchema = z.object({
  paymentIntentId: z.string().min(1),
  status: z.enum(['succeeded', 'failed', 'cancelled']),
  externalRef: z.string().min(1).max(256).optional()
});

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toMoneyString(value) {
  return roundMoney(value).toFixed(2);
}

function buildCartLineKey(productId, variantId) {
  return variantId ? `${productId}:${variantId}` : `${productId}:base`;
}

function hasValidWebhookSignature(signature) {
  if (typeof signature !== 'string') {
    return false;
  }

  const expected = Buffer.from(env.STRIPE_WEBHOOK_SECRET, 'utf8');
  const provided = Buffer.from(signature, 'utf8');

  if (expected.length !== provided.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, provided);
}

function calculateTotals(cartItems, shippingAmount) {
  const subtotal = roundMoney(
    cartItems.reduce((accumulator, item) => accumulator + Number(item.unitPrice) * item.quantity, 0)
  );
  const taxAmount = roundMoney(subtotal * env.CHECKOUT_TAX_RATE);
  const shipping = roundMoney(shippingAmount);
  const totalAmount = roundMoney(subtotal + taxAmount + shipping);

  return {
    subtotal,
    taxAmount,
    shippingAmount: shipping,
    totalAmount,
    currency: 'USD'
  };
}

function serializeCart(cart) {
  const items = (cart?.items || []).map((item) => {
    const unitPrice = Number(item.unitPrice);
    const lineTotal = roundMoney(unitPrice * item.quantity);

    return {
      id: item.id,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        status: item.product.status
      },
      variant: item.variant
        ? {
            id: item.variant.id,
            sku: item.variant.sku,
            name: item.variant.name,
            inventory: item.variant.inventory
              ? {
                  quantityOnHand: item.variant.inventory.quantityOnHand,
                  quantityReserved: item.variant.inventory.quantityReserved
                }
              : null
          }
        : null
    };
  });

  const totals = calculateTotals(items.map((item) => ({ unitPrice: item.unitPrice, quantity: item.quantity })), env.CHECKOUT_DEFAULT_SHIPPING);

  return {
    id: cart?.id || null,
    items,
    totals
  };
}

function serializeOrder(order) {
  return {
    id: order.id,
    status: order.status,
    subtotal: Number(order.subtotal),
    taxAmount: Number(order.taxAmount),
    shippingAmount: Number(order.shippingAmount),
    totalAmount: Number(order.totalAmount),
    currency: order.currency,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal)
    }))
  };
}

async function getOrCreateCart(userId) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });
}

async function fetchCartWithItems(userId) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              _count: {
                select: {
                  variants: true
                }
              }
            }
          },
          variant: {
            include: {
              inventory: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });
}

function ensureInventoryAvailable(variant, desiredQuantity) {
  if (!variant) {
    return;
  }

  if (!variant.inventory) {
    throw new HttpError(409, 'Inventory record is missing for the selected variant.');
  }

  if (variant.inventory.quantityOnHand < desiredQuantity) {
    throw new HttpError(409, 'Insufficient inventory for requested quantity.');
  }
}

export const checkoutRouter = Router();

checkoutRouter.post('/webhooks/payments/stripe', async (req, res, next) => {
  try {
    const signature = req.headers['x-stripe-signature'];
    if (!hasValidWebhookSignature(signature)) {
      throw new HttpError(401, 'Invalid webhook signature.');
    }

    const input = paymentWebhookSchema.parse(req.body || {});
    const mappedStatus =
      input.status === 'succeeded'
        ? PaymentIntentStatus.SUCCEEDED
        : input.status === 'failed'
          ? PaymentIntentStatus.FAILED
          : PaymentIntentStatus.CANCELLED;

    const whereClause = {
      id: input.paymentIntentId,
      ...(mappedStatus === PaymentIntentStatus.SUCCEEDED
        ? { status: { in: [PaymentIntentStatus.REQUIRES_CONFIRMATION, PaymentIntentStatus.SUCCEEDED] } }
        : { status: { not: PaymentIntentStatus.SUCCEEDED } })
    };

    const updated = await prisma.paymentIntent.updateMany({
      where: whereClause,
      data: {
        status: mappedStatus,
        externalRef: input.externalRef || `webhook_${input.paymentIntentId}`
      }
    });

    if (updated.count === 0) {
      throw new HttpError(404, 'Payment intent not found or transition not allowed.');
    }

    return res.status(202).json(successResponse({
      accepted: true,
      paymentIntentId: input.paymentIntentId,
      status: mappedStatus
    }));
  } catch (error) {
    return next(error);
  }
});

checkoutRouter.use(requireAuth);

checkoutRouter.get('/cart', async (req, res, next) => {
  try {
    const cart = await fetchCartWithItems(req.auth.userId);

    return res.status(200).json(successResponse({
      cart: serializeCart(cart)
    }));
  } catch (error) {
    return next(error);
  }
});

checkoutRouter.post('/cart/items', async (req, res, next) => {
  try {
    const input = addCartItemSchema.parse(req.body || {});

    const product = await prisma.product.findFirst({
      where: {
        id: input.productId,
        status: ProductStatus.PUBLISHED
      },
      include: {
        _count: {
          select: {
            variants: true
          }
        }
      }
    });

    if (!product) {
      throw new HttpError(404, 'Product not found.');
    }

    if (product._count.variants > 0 && !input.variantId) {
      throw new HttpError(400, 'Variant selection is required for this product.');
    }

    let variant = null;
    if (input.variantId) {
      variant = await prisma.productVariant.findFirst({
        where: {
          id: input.variantId,
          productId: product.id
        },
        include: {
          inventory: true
        }
      });

      if (!variant) {
        throw new HttpError(400, 'Variant does not belong to the selected product.');
      }
    }

    const cart = await getOrCreateCart(req.auth.userId);
    const lineKey = buildCartLineKey(product.id, input.variantId || null);
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        lineKey
      }
    });

    const desiredQuantity = (existingItem?.quantity || 0) + input.quantity;
    ensureInventoryAvailable(variant, desiredQuantity);

    const unitPrice = roundMoney(Number(product.price) + Number(variant?.additionalCost || 0));

    await prisma.cartItem.upsert({
      where: {
        cartId_lineKey: {
          cartId: cart.id,
          lineKey
        }
      },
      update: {
        quantity: desiredQuantity,
        unitPrice: toMoneyString(unitPrice)
      },
      create: {
        cartId: cart.id,
        lineKey,
        productId: product.id,
        variantId: variant?.id || null,
        quantity: input.quantity,
        unitPrice: toMoneyString(unitPrice)
      }
    });

    const updatedCart = await fetchCartWithItems(req.auth.userId);

    return res.status(200).json(successResponse({
      cart: serializeCart(updatedCart)
    }));
  } catch (error) {
    return next(error);
  }
});

checkoutRouter.patch('/cart/items/:itemId', async (req, res, next) => {
  try {
    const input = updateCartItemSchema.parse(req.body || {});

    const existingItem = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: {
        cart: true,
        product: {
          include: {
            _count: {
              select: {
                variants: true
              }
            }
          }
        },
        variant: {
          include: {
            inventory: true
          }
        }
      }
    });

    if (!existingItem || existingItem.cart.userId !== req.auth.userId) {
      throw new HttpError(404, 'Cart item not found.');
    }

    if (existingItem.product._count.variants > 0 && !existingItem.variantId) {
      throw new HttpError(409, 'Variant selection is required for this item.');
    }

    ensureInventoryAvailable(existingItem.variant, input.quantity);

    const unitPrice = roundMoney(Number(existingItem.product.price) + Number(existingItem.variant?.additionalCost || 0));

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: input.quantity,
        unitPrice: toMoneyString(unitPrice)
      }
    });

    const updatedCart = await fetchCartWithItems(req.auth.userId);

    return res.status(200).json(successResponse({
      cart: serializeCart(updatedCart)
    }));
  } catch (error) {
    return next(error);
  }
});

checkoutRouter.delete('/cart/items/:itemId', async (req, res, next) => {
  try {
    const existingItem = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
      include: {
        cart: true
      }
    });

    if (!existingItem || existingItem.cart.userId !== req.auth.userId) {
      throw new HttpError(404, 'Cart item not found.');
    }

    await prisma.cartItem.delete({ where: { id: existingItem.id } });

    const updatedCart = await fetchCartWithItems(req.auth.userId);

    return res.status(200).json(successResponse({
      cart: serializeCart(updatedCart)
    }));
  } catch (error) {
    return next(error);
  }
});

checkoutRouter.post('/checkout/quote', async (req, res, next) => {
  try {
    quoteSchema.parse(req.body || {});
    const cart = await fetchCartWithItems(req.auth.userId);

    if (!cart || cart.items.length === 0) {
      throw new HttpError(400, 'Cart is empty.');
    }

    const totals = calculateTotals(cart.items, env.CHECKOUT_DEFAULT_SHIPPING);

    return res.status(200).json(successResponse({
      cartId: cart.id,
      itemCount: cart.items.length,
      ...totals
    }));
  } catch (error) {
    return next(error);
  }
});

checkoutRouter.post('/checkout/intent', async (req, res, next) => {
  try {
    const input = checkoutIntentSchema.parse(req.body || {});
    const cart = await fetchCartWithItems(req.auth.userId);

    if (!cart || cart.items.length === 0) {
      throw new HttpError(400, 'Cart is empty.');
    }

    const totals = calculateTotals(cart.items, env.CHECKOUT_DEFAULT_SHIPPING);
    const idempotencyKey = input.idempotencyKey || crypto.randomUUID();

    const existingIntent = await prisma.paymentIntent.findUnique({
      where: {
        userId_idempotencyKey: {
          userId: req.auth.userId,
          idempotencyKey
        }
      }
    });

    if (existingIntent) {
      return res.status(200).json(successResponse({
        id: existingIntent.id,
        status: existingIntent.status,
        amount: Number(existingIntent.amount),
        currency: existingIntent.currency,
        idempotencyKey: existingIntent.idempotencyKey
      }));
    }

    let paymentIntent;
    try {
      paymentIntent = await prisma.paymentIntent.create({
        data: {
          userId: req.auth.userId,
          subtotalAmount: toMoneyString(totals.subtotal),
          taxAmount: toMoneyString(totals.taxAmount),
          shippingAmount: toMoneyString(totals.shippingAmount),
          amount: toMoneyString(totals.totalAmount),
          currency: totals.currency,
          status: PaymentIntentStatus.REQUIRES_CONFIRMATION,
          idempotencyKey
        }
      });
    } catch (error) {
      if (error?.code === 'P2002') {
        const canonicalIntent = await prisma.paymentIntent.findUnique({
          where: {
            userId_idempotencyKey: {
              userId: req.auth.userId,
              idempotencyKey
            }
          }
        });

        if (canonicalIntent) {
          return res.status(200).json(successResponse({
            id: canonicalIntent.id,
            status: canonicalIntent.status,
            amount: Number(canonicalIntent.amount),
            currency: canonicalIntent.currency,
            idempotencyKey: canonicalIntent.idempotencyKey
          }));
        }
      }

      throw error;
    }

    return res.status(201).json(successResponse({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: Number(paymentIntent.amount),
      currency: paymentIntent.currency,
      idempotencyKey: paymentIntent.idempotencyKey
    }));
  } catch (error) {
    return next(error);
  }
});

checkoutRouter.post('/checkout/confirm', async (req, res, next) => {
  try {
    const input = checkoutConfirmSchema.parse(req.body || {});

    const paymentIntent = await prisma.paymentIntent.findFirst({
      where: {
        id: input.paymentIntentId,
        userId: req.auth.userId
      }
    });

    if (!paymentIntent) {
      throw new HttpError(404, 'Payment intent not found.');
    }

    if (paymentIntent.status !== PaymentIntentStatus.SUCCEEDED) {
      throw new HttpError(409, 'Payment has not been verified yet. Retry after provider confirmation.');
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        paymentIntentId: paymentIntent.id
      },
      include: {
        items: true
      }
    });

    if (existingOrder) {
      return res.status(200).json(successResponse({
        order: serializeOrder(existingOrder)
      }));
    }

    const cart = await fetchCartWithItems(req.auth.userId);
    if (!cart || cart.items.length === 0) {
      throw new HttpError(400, 'Cart is empty.');
    }

    const currentTotals = calculateTotals(cart.items, Number(paymentIntent.shippingAmount));
    if (toMoneyString(currentTotals.totalAmount) !== toMoneyString(Number(paymentIntent.amount))) {
      throw new HttpError(409, 'Cart totals changed. Request a new checkout intent.');
    }

    let order;
    try {
      order = await prisma.$transaction(async (transaction) => {
        for (const cartItem of cart.items) {
          if (cartItem.product._count.variants > 0 && !cartItem.variantId) {
            throw new HttpError(409, `Variant selection is required for item ${cartItem.id}.`);
          }

          if (cartItem.variantId) {
            const updated = await transaction.inventoryLevel.updateMany({
              where: {
                variantId: cartItem.variantId,
                quantityOnHand: {
                  gte: cartItem.quantity
                }
              },
              data: {
                quantityOnHand: {
                  decrement: cartItem.quantity
                },
                quantityReserved: {
                  increment: cartItem.quantity
                }
              }
            });

            if (updated.count !== 1) {
              throw new HttpError(409, `Insufficient inventory for item ${cartItem.id}.`);
            }
          }
        }

        const createdOrder = await transaction.order.create({
          data: {
            userId: req.auth.userId,
            paymentIntentId: paymentIntent.id,
            status: OrderStatus.PAID,
            subtotal: toMoneyString(Number(paymentIntent.subtotalAmount)),
            taxAmount: toMoneyString(Number(paymentIntent.taxAmount)),
            shippingAmount: toMoneyString(Number(paymentIntent.shippingAmount)),
            totalAmount: toMoneyString(Number(paymentIntent.amount)),
            currency: paymentIntent.currency,
            items: {
              create: cart.items.map((cartItem) => ({
                productId: cartItem.productId,
                variantId: cartItem.variantId,
                productName: cartItem.product.name,
                sku: cartItem.variant?.sku || null,
                quantity: cartItem.quantity,
                unitPrice: toMoneyString(Number(cartItem.unitPrice)),
                lineTotal: toMoneyString(Number(cartItem.unitPrice) * cartItem.quantity)
              }))
            }
          },
          include: {
            items: true
          }
        });

        await transaction.cartItem.deleteMany({
          where: {
            cartId: cart.id
          }
        });

        return createdOrder;
      });
    } catch (error) {
      if (error?.code === 'P2002') {
        const canonicalOrder = await prisma.order.findUnique({
          where: {
            paymentIntentId: paymentIntent.id
          },
          include: {
            items: true
          }
        });

        if (canonicalOrder) {
          return res.status(200).json(successResponse({
            order: serializeOrder(canonicalOrder)
          }));
        }
      }

      throw error;
    }

    return res.status(200).json(successResponse({
      order: serializeOrder(order)
    }));
  } catch (error) {
    return next(error);
  }
});
