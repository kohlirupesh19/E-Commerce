import { verifyAccessToken } from '../lib/auth-tokens.js';
import { prisma } from '../lib/prisma.js';

export async function requireAuth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Missing bearer token.'
    });
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  try {
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'User is not authorized.'
      });
    }

    req.auth = {
      userId: user.id,
      email: user.email,
      name: user.name
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid bearer token.'
    });
  }
}
