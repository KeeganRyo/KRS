import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function hashPin(pin) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(pin, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPin(pin, stored) {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  const test = scryptSync(pin, salt, 32);
  const real = Buffer.from(hash, 'hex');
  return test.length === real.length && timingSafeEqual(test, real);
}
