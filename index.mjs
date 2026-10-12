/** Shared client for carry-intel: buyer address resolution (kit v5 — Promise-returning). */
import fs from 'fs';
export { BASE } from './lib/payment-policy.mjs';

export const DEFAULT_WALLET = process.env.CARRY_WALLET || null;

export async function buyerAddress(wp) {
  const { createKeyPairSignerFromPrivateKeyBytes } = await import('@solana/kit');
  const raw = Uint8Array.from(JSON.parse(fs.readFileSync(wp, 'utf8')));
  const secret = raw.length === 64 ? raw.slice(0, 32) : raw;
  const signer = await createKeyPairSignerFromPrivateKeyBytes(secret);
  return signer.address;
}
