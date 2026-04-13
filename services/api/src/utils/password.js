import bcrypt from 'bcryptjs';

const DEFAULT_SALT_ROUNDS = 12;

export function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, DEFAULT_SALT_ROUNDS);
}

export function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}
