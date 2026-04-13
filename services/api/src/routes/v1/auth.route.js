import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { issueAuthTokens, verifyRefreshToken } from '../../lib/auth-tokens.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { successResponse } from '../../utils/response.js';
import { HttpError } from '../../utils/http-error.js';
import { env } from '../../config/env.js';

const refreshTokenCookieName = 'obsidian_refresh_token';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(10).max(128)
});

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(128)
});

const forgotPasswordSchema = z.object({
  email: z.string().trim().email().toLowerCase()
});

const resetPasswordSchema = z.object({
  token: z.string().min(16),
  newPassword: z.string().min(10).max(128)
});

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function parseDurationMs(duration) {
  const match = /^(\d+)([smhd])$/i.exec(duration);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const unitToMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * unitToMs[unit];
}

function setRefreshTokenCookie(res, refreshToken) {
  res.cookie(refreshTokenCookieName, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: parseDurationMs(env.JWT_REFRESH_TTL)
  });
}

function clearRefreshTokenCookie(res) {
  res.clearCookie(refreshTokenCookieName, {
    path: '/api/v1/auth'
  });
}

export const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false
});

authRouter.use(authLimiter);

authRouter.post('/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (existingUser) {
      throw new HttpError(409, 'An account already exists for this email address.');
    }

    const passwordHash = await hashPassword(input.password);

    const createdUser = await prisma.$transaction(async (transaction) => {
      const role = await transaction.role.upsert({
        where: { name: 'CUSTOMER' },
        update: {},
        create: { name: 'CUSTOMER' }
      });

      const user = await transaction.user.create({
        data: {
          name: input.name,
          email: input.email,
          passwordHash,
          isActive: true
        }
      });

      await transaction.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id
        }
      });

      return user;
    });

    const tokens = issueAuthTokens(createdUser);

    if (!tokens.refreshTokenExpiresAt) {
      throw new Error('Refresh token expiration is missing.');
    }

    await prisma.refreshSession.create({
      data: {
        userId: createdUser.id,
        jti: tokens.refreshJti,
        tokenHash: hashToken(tokens.refreshToken),
        expiresAt: tokens.refreshTokenExpiresAt
      }
    });

    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(201).json(successResponse({
      user: sanitizeUser(createdUser),
      accessToken: tokens.accessToken
    }));
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.isActive) {
      throw new HttpError(401, 'Invalid credentials.');
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new HttpError(401, 'Invalid credentials.');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const tokens = issueAuthTokens(updatedUser);

    if (!tokens.refreshTokenExpiresAt) {
      throw new Error('Refresh token expiration is missing.');
    }

    await prisma.refreshSession.create({
      data: {
        userId: updatedUser.id,
        jti: tokens.refreshJti,
        tokenHash: hashToken(tokens.refreshToken),
        expiresAt: tokens.refreshTokenExpiresAt
      }
    });

    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(200).json(successResponse({
      user: sanitizeUser(updatedUser),
      accessToken: tokens.accessToken
    }));
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[refreshTokenCookieName];

    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        await prisma.refreshSession.updateMany({
          where: {
            userId: decoded.sub,
            jti: decoded.jti,
            tokenHash: hashToken(refreshToken),
            revokedAt: null
          },
          data: {
            revokedAt: new Date()
          }
        });
      } catch {
      }
    }

    clearRefreshTokenCookie(res);
    return res.status(200).json(successResponse({ loggedOut: true }));
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[refreshTokenCookieName];

    if (!refreshToken) {
      throw new HttpError(401, 'Refresh token is required.');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new HttpError(401, 'Invalid refresh token.');
    }

    const session = await prisma.refreshSession.findUnique({
      where: {
        userId_jti: {
          userId: decoded.sub,
          jti: decoded.jti
        }
      }
    });

    if (!session || session.revokedAt || session.expiresAt < new Date() || session.tokenHash !== hashToken(refreshToken)) {
      throw new HttpError(401, 'Invalid refresh token.');
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

    if (!user || !user.isActive) {
      throw new HttpError(401, 'Invalid refresh token.');
    }

    const tokens = issueAuthTokens(user);

    if (!tokens.refreshTokenExpiresAt) {
      throw new Error('Refresh token expiration is missing.');
    }

    await prisma.$transaction([
      prisma.refreshSession.update({
        where: {
          userId_jti: {
            userId: decoded.sub,
            jti: decoded.jti
          }
        },
        data: {
          revokedAt: new Date()
        }
      }),
      prisma.refreshSession.create({
        data: {
          userId: user.id,
          jti: tokens.refreshJti,
          tokenHash: hashToken(tokens.refreshToken),
          expiresAt: tokens.refreshTokenExpiresAt
        }
      })
    ]);

    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(200).json(successResponse({
      user: sanitizeUser(user),
      accessToken: tokens.accessToken
    }));
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/forgot-password', forgotPasswordLimiter, async (req, res, next) => {
  try {
    const input = forgotPasswordSchema.parse(req.body || {});

    if (env.NODE_ENV === 'production') {
      throw new HttpError(503, 'Password reset delivery is not configured.');
    }

    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      await prisma.$transaction([
        prisma.passwordResetToken.updateMany({
          where: {
            userId: user.id,
            usedAt: null
          },
          data: {
            usedAt: new Date()
          }
        }),
        prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt
          }
        })
      ]);

      console.info('[auth][password-reset][dev-delivery]', {
        email: user.email,
        token: rawToken
      });
    }

    return res.status(200).json(successResponse({
      accepted: true,
      message: 'If this email exists, password reset instructions were issued.'
    }));
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/reset-password', async (req, res, next) => {
  try {
    const input = resetPasswordSchema.parse(req.body || {});
    const tokenHash = crypto.createHash('sha256').update(input.token).digest('hex');

    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.usedAt || tokenRecord.expiresAt < new Date()) {
      throw new HttpError(400, 'The reset token is invalid or expired.');
    }

    const newPasswordHash = await hashPassword(input.newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { passwordHash: newPasswordHash }
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: tokenRecord.userId,
          usedAt: null
        },
        data: { usedAt: new Date() }
      }),
      prisma.refreshSession.updateMany({
        where: {
          userId: tokenRecord.userId,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      })
    ]);

    return res.status(200).json(successResponse({ reset: true }));
  } catch (error) {
    return next(error);
  }
});
