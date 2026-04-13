import { PrismaClient, RoleName, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedRoles() {
  const roleNames = [RoleName.ADMIN, RoleName.CUSTOMER, RoleName.MERCHANDISER, RoleName.SUPPORT];

  for (const roleName of roleNames) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName }
    });
  }
}

async function seedAdmin() {
  const allowAdminSeed = process.env.SEED_ALLOW_ADMIN === 'true';
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!allowAdminSeed) {
    console.info('[seed] skipping admin bootstrap: SEED_ALLOW_ADMIN is not set to true');
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Admin seeding is disabled in production.');
  }

  if (!adminEmail || !adminPassword) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required when SEED_ALLOW_ADMIN=true.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Platform Admin',
      passwordHash
    }
  });

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.ADMIN } });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id
    }
  });
}

async function seedCatalog() {
  const categories = [
    {
      name: 'Timepieces',
      slug: 'timepieces',
      description: 'Precision luxury watches and chronographs.'
    },
    {
      name: 'Jewelry',
      slug: 'jewelry',
      description: 'Curated fine jewelry and gemstone pieces.'
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        isActive: true
      },
      create: {
        ...category,
        isActive: true
      }
    });
  }

  const timepiecesCategory = await prisma.category.findUniqueOrThrow({ where: { slug: 'timepieces' } });

  const product = await prisma.product.upsert({
    where: { slug: 'onyx-chronograph-x1' },
    update: {
      status: ProductStatus.PUBLISHED,
      price: '14200.00',
      rating: '4.9',
      reviewCount: 84
    },
    create: {
      name: 'The Onyx Chronograph X1',
      slug: 'onyx-chronograph-x1',
      description: 'Flagship chronograph with sapphire crystal and midnight finish.',
      price: '14200.00',
      currency: 'USD',
      rating: '4.9',
      reviewCount: 84,
      status: ProductStatus.PUBLISHED,
      categoryId: timepiecesCategory.id
    }
  });

  const variant = await prisma.productVariant.upsert({
    where: { sku: 'OBS-TIME-ONYX-X1-STD' },
    update: {
      name: 'Standard Edition',
      additionalCost: '0.00',
      productId: product.id
    },
    create: {
      productId: product.id,
      sku: 'OBS-TIME-ONYX-X1-STD',
      name: 'Standard Edition',
      additionalCost: '0.00'
    }
  });

  await prisma.inventoryLevel.upsert({
    where: { variantId: variant.id },
    update: {
      quantityOnHand: 25,
      quantityReserved: 0
    },
    create: {
      variantId: variant.id,
      quantityOnHand: 25,
      quantityReserved: 0
    }
  });
}

async function main() {
  await seedRoles();
  await seedAdmin();
  await seedCatalog();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('[seed] failed', error);
    await prisma.$disconnect();
    process.exit(1);
  });
