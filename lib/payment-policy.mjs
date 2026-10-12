export const BASE = 'https://devbox.tail873466.ts.net:10000';
export const ROUTES = Object.freeze({
  verdicts: Object.freeze({ path: '/carry/verdicts', price: 0.10, amount: '100000' }),
  opportunities: Object.freeze({ path: '/carry/opportunities', price: 0.50, amount: '500000' }),
  digest: Object.freeze({ path: '/carry/digest/latest', price: 0.02, amount: '20000' }),
});

const NETWORK = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const PAY_TO = '22PpHwVGiikZMJKPLjMmbaUhfkoLG6J28NjJurbsM2g1';
const MAX_CHALLENGE_TIMEOUT_SECONDS = 300;

export function validatePaymentChallenge(challenge, requestUrl) {
  let url;
  try { url = new URL(requestUrl); } catch { throw new Error('invalid payment URL'); }
  if (url.protocol !== 'https:' || url.origin !== new URL(BASE).origin) {
    throw new Error('payment challenge origin mismatch');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error('payment request URL contains disallowed components');
  }

  const route = Object.values(ROUTES).find((entry) => entry.path === url.pathname);
  if (!route) throw new Error('unpriced payment route');
  if (challenge?.x402Version !== 2) throw new Error('unsupported payment challenge version');
  if (challenge.resource?.url !== url.href) throw new Error('payment challenge resource URL mismatch');
  if (!Array.isArray(challenge.accepts) || challenge.accepts.length !== 1) {
    throw new Error('payment challenge must contain exactly one accepted payment');
  }

  const accepted = challenge.accepts[0];
  if (accepted.scheme !== 'exact') throw new Error('payment scheme mismatch');
  if (accepted.network !== NETWORK) throw new Error('payment network mismatch');
  if (accepted.asset !== USDC_MINT) throw new Error('payment asset mismatch');
  if (accepted.payTo !== PAY_TO) throw new Error('payment recipient mismatch');
  if (accepted.amount !== route.amount) throw new Error('payment amount mismatch');
  if (!Number.isInteger(accepted.maxTimeoutSeconds) || accepted.maxTimeoutSeconds < 1 || accepted.maxTimeoutSeconds > MAX_CHALLENGE_TIMEOUT_SECONDS) {
    throw new Error('payment challenge timeout outside policy');
  }
  return accepted;
}
