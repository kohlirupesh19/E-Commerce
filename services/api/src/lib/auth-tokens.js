import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../config/env.js';

function signToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function issueAuthTokens(user) {
  const refreshJti = crypto.randomUUID();
  const tokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name
  };

  const accessToken = signToken({ ...tokenPayload, type: 'access' }, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_TTL);
  const refreshToken = signToken({ ...tokenPayload, type: 'refresh', jti: refreshJti }, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_TTL);
  const refreshTokenDecoded = jwt.decode(refreshToken);

  return {
    accessToken,
    refreshToken,
    refreshJti,
    refreshTokenExpiresAt:
      refreshTokenDecoded && typeof refreshTokenDecoded === 'object' && typeof refreshTokenDecoded.exp === 'number'
        ? new Date(refreshTokenDecoded.exp * 1000)
        : null
  };
}

export function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (decoded.type !== 'refresh') {
    throw new Error('Invalid refresh token type');
  }

  return decoded;
}

export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (decoded.type !== 'access') {
    throw new Error('Invalid access token type');
  }

  return decoded;
}
