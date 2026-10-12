#!/usr/bin/env node
/**
 * carry-intel CLI — buy Hyperliquid funding-carry intelligence per call via x402.
 *
 *   carry-intel verdicts       $0.10 — live verdicts + tracked status (sizes redacted by default)
 *   carry-intel opportunities  $0.50 — full-universe spot-liquidity-screened scan
 *   carry-intel digest         $0.02 — latest daily settled-prints digest
 *   carry-intel free           FREE  — previous published digest (sample/latest dates included)
 *   carry-intel balance               — buyer float + treasury revenue
 *   carry-intel mcp-config            — print MCP client config for this server
 *
 * Wallet: file with JSON array of 32/64 bytes (Solana keypair). Path via
 *   CARRY_WALLET env or --wallet flag. Default: ~/.carry-intel/wallet.json
 * No account. No API key. Payment settles on-chain via the x402 facilitator.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { x402Client, x402HTTPClient } from '@x402/core/client';
import { registerExactSvmScheme } from '@x402/svm/exact/client';
import { toClientSvmSigner } from '@x402/svm';
import { createKeyPairSignerFromPrivateKeyBytes } from '@solana/kit';
import { BASE, ROUTES, validatePaymentChallenge } from '../lib/payment-policy.mjs';

function walletPath(args) {
  const i = args.indexOf('--wallet');
  if (i >= 0 && args[i + 1]) return args[i + 1];
  return process.env.CARRY_WALLET || path.join(os.homedir(), '.carry-intel', 'wallet.json');
}

async function loadSigner(wp) {
  const raw = Uint8Array.from(JSON.parse(fs.readFileSync(wp, 'utf8')));
  const secret = raw.length === 64 ? raw.slice(0, 32) : raw;
  // kit v5: createKeyPairSignerFromPrivateKeyBytes returns a Promise
  return toClientSvmSigner(await createKeyPairSignerFromPrivateKeyBytes(secret));
}

async function paidFetch(route, wp) {
  let signer;
  try { signer = await loadSigner(wp); } catch (e) {
    console.error(`wallet load failed (${e.message}). Put a JSON array of 32/64 bytes at ${wp}`);
    process.exit(2);
  }
  const core = x402Client.fromConfig({ schemes: [] });
  registerExactSvmScheme(core, { signer });
  const http = new x402HTTPClient(core);
  const url = BASE + route;
  let r = await fetch(url, { redirect: 'error' });
  if (r.status === 402) {
    const pr = http.getPaymentRequiredResponse((n) => r.headers.get(n));
    validatePaymentChallenge(pr, url);
    const payload = await http.createPaymentPayload(pr);
    r = await fetch(url, { headers: http.encodePaymentSignatureHeader(payload), redirect: 'error' });
  }
  if (r.status === 402) throw new Error('payment rejected — check wallet USDC balance (Solana)');
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const res = await http.processResponse(r);
  if (res.paymentStatus !== 'settled') throw new Error(`unexpected payment status: ${res.paymentStatus ?? 'missing'}`);
  const prov = r.headers.get('x-carry-provenance');
  return { body: res.body, provenance: prov };
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args.find((a) => !a.startsWith('--'));
  const wp = walletPath(args);

  if (!cmd || cmd === 'help') {
    console.log(`carry-intel — Hyperliquid funding-carry intelligence, per call via x402

  verdicts       $0.10  live verdicts + tracked status; exact position sizes redacted by default
  opportunities  $0.50  positive-funding candidates screened by USDC spot pair and 24h volume ≥ $10k
  digest         $0.02  latest daily settled-prints digest (markdown)
  free           $0.00  previous published digest — sample and latest dates included
  balance               buyer float (USDC) via public RPC
  mcp-config            JSON config to add this server to any MCP client
  license               data license terms (no-resale, operator-side HMAC watermark)

Env: CARRY_WALLET (keypair JSON path, default ~/.carry-intel/wallet.json)
Free sample: ${BASE}/carry/digest/free — no payment needed.`);
    return;
  }

  if (cmd === 'mcp-config') {
    console.log(JSON.stringify({ mcpServers: { 'carry-intel': { url: `${BASE}/mcp` } } }, null, 2));
    return;
  }

  if (cmd === 'license') {
    const r = await fetch(`${BASE}/license`);
    console.log(await r.text());
    return;
  }

  if (cmd === 'free') {
    const r = await fetch(`${BASE}/carry/digest/free`);
    console.log(await r.text());
    return;
  }

  if (cmd === 'balance') {
    const { buyerAddress } = await import('../index.mjs');
    try {
      const addr = await buyerAddress(wp);
      const r = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getTokenAccountsByOwner', params: [addr, { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }, { encoding: 'jsonParsed' }] }),
      });
      const j = await r.json();
      const v = (j.result?.value ?? []).reduce((s, a) => s + (a.account.data.parsed.info.tokenAmount.uiAmount || 0), 0);
      console.log(`buyer ${addr}: ${v.toFixed(6)} USDC`);
    } catch (e) { console.error('balance check failed:', e.message); process.exit(1); }
    return;
  }

  const route = ROUTES[cmd];
  if (!route) { console.error(`unknown command: ${cmd} (try 'help')`); process.exit(1); }
  const { body, provenance } = await paidFetch(route.path, wp);
  const text = typeof body === 'string' ? body : JSON.stringify(body, null, 2);
  console.log(text);
  if (provenance) console.error(`\n[operator-side HMAC watermark; not independently buyer-verifiable: ${provenance}]`);
}

main().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
