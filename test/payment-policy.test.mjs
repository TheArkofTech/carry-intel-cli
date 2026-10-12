import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE, ROUTES, validatePaymentChallenge } from '../lib/payment-policy.mjs';

const NETWORK = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const PAY_TO = '22PpHwVGiikZMJKPLjMmbaUhfkoLG6J28NjJurbsM2g1';

function makeChallenge(route, amount) {
  return {
    x402Version: 2,
    resource: { url: BASE + route },
    accepts: [{ scheme: 'exact', network: NETWORK, amount, asset: USDC, payTo: PAY_TO, maxTimeoutSeconds: 300 }],
  };
}

test('accepts exactly the configured prices for the allowlisted routes', () => {
  for (const route of Object.values(ROUTES)) {
    const challenge = makeChallenge(route.path, route.amount);
    assert.equal(validatePaymentChallenge(challenge, BASE + route.path), challenge.accepts[0]);
  }
});

test('rejects altered amount, recipient, asset, network, scheme, resource, timeout, or extra accepts', () => {
  const mutations = [
    (p) => { p.accepts[0].amount = '999999999'; },
    (p) => { p.accepts[0].payTo = '11111111111111111111111111111111'; },
    (p) => { p.accepts[0].asset = 'So11111111111111111111111111111111111111112'; },
    (p) => { p.accepts[0].network = 'solana:devnet'; },
    (p) => { p.accepts[0].scheme = 'other'; },
    (p) => { p.resource.url = 'https://attacker.example/collect'; },
    (p) => { p.accepts[0].maxTimeoutSeconds = 301; },
    (p) => { p.accepts.push({ ...p.accepts[0] }); },
  ];
  for (const mutate of mutations) {
    const p = makeChallenge('/carry/digest/latest', String(ROUTES.digest.amount));
    mutate(p);
    assert.throws(() => validatePaymentChallenge(p, BASE + '/carry/digest/latest'));
  }
});

test('rejects unknown route, query string, wrong origin, and non-v2 challenge', () => {
  const p = makeChallenge('/carry/digest/latest', String(ROUTES.digest.amount));
  assert.throws(() => validatePaymentChallenge(p, BASE + '/carry/unknown'), /route/i);
  assert.throws(() => validatePaymentChallenge(p, BASE + '/carry/digest/latest?to=attacker'), /url/i);
  assert.throws(() => validatePaymentChallenge(p, 'https://attacker.example/carry/digest/latest'), /origin/i);
  assert.throws(() => validatePaymentChallenge({ ...p, x402Version: 1 }, BASE + '/carry/digest/latest'), /version/i);
});
