import { Router } from 'express';
import { ProductStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { successResponse } from '../../utils/response.js';
import { HttpError } from '../../utils/http-error.js';

const productQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().int().positive().max(100).default(24),
  offset: z.coerce.number().int().nonnegative().default(0)
});

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    currency: product.currency,
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    status: product.status,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug
        }
      : null,
    variants: (product.variants || []).map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      name: variant.name,
      additionalCost: Number(variant.additionalCost),
      inventory: variant.inventory
        ? {
            quantityOnHand: variant.inventory.quantityOnHand,
            quantityReserved: variant.inventory.quantityReserved
          }
        : null
    }))
  };
}

export const catalogRouter = Router();

catalogRouter.get('/categories', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return res.status(200).json(successResponse(categories));
  } catch (error) {
    return next(error);
  }
});

catalogRouter.get('/products', async (req, res, next) => {
  try {
    const query = productQuerySchema.parse(req.query);

    const where = {
      status: ProductStatus.PUBLISHED,
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.category ? { category: { is: { slug: query.category } } } : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            price: {
              ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
              ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {})
            }
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy: { createdAt: 'desc' },
        skip: query.offset,
        take: query.limit
      }),
      prisma.product.count({ where })
    ]);

    return res.status(200).json(successResponse({
      items: items.map((product) => serializeProduct({ ...product, variants: [] })),
      total,
      limit: query.limit,
      offset: query.offset
    }));
  } catch (error) {
    return next(error);
  }
});

catalogRouter.get('/products/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        status: ProductStatus.PUBLISHED,
        OR: [{ id: req.params.id }, { slug: req.params.id }]
      },
      include: {
        category: true,
        variants: {
          include: {
            inventory: true
          }
        }
      }
    });

    if (!product) {
      throw new HttpError(404, 'Product not found');
    }

    return res.status(200).json(successResponse(serializeProduct(product)));
  } catch (error) {
    return next(error);
  }
});

catalogRouter.get('/products/:id/related', async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        status: ProductStatus.PUBLISHED,
        OR: [{ id: req.params.id }, { slug: req.params.id }]
      }
    });

    if (!product) {
      throw new HttpError(404, 'Product not found');
    }

    const related = await prisma.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        categoryId: product.categoryId,
        id: { not: product.id }
      },
      include: {
        category: true
      },
      orderBy: { reviewCount: 'desc' },
      take: 4
    });

    return res.status(200).json(successResponse(related.map((item) => serializeProduct({ ...item, variants: [] }))));
  } catch (error) {
    return next(error);
  }
});
