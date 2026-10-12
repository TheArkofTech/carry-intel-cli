# carry-intel CLI — Hyperliquid funding-carry intelligence, per call via x402

Buy live carry intelligence with on-chain micropayments. No API key. No account. No signup.
Every call settles USDC on Solana mainnet through the x402 facilitator.

```
npx github:TheArkofTech/carry-intel-cli <command>
```

## Commands

| Command | Price | What you get |
|---|---|---|
| `free` | **$0.00** | Previous published digest; response names the sample and latest-report dates |
| `digest` | $0.02 | Latest daily settled-prints funding digest (markdown) |
| `verdicts` | $0.10 | Live EDGE/BASELINE/NEG verdicts per tracked leg + basis gates; exact sizes redacted by default |
| `opportunities` | $0.50 | Positive-funding perps ranked by spot-liquidity screen; depth/fees/slippage/basis/execution unchecked |
| `balance` | free | Your buyer wallet's USDC balance |
| `mcp-config` | free | JSON config to add this server to any MCP client |
| `license` | free | Proprietary Data License (no-resale; operator-verifiable HMAC watermark) |

## Wallet setup

```bash
mkdir -p ~/.carry-intel
# write a JSON array of 32 or 64 bytes (your Solana keypair) to:
#   ~/.carry-intel/wallet.json        (Linux/macOS)
#   %USERPROFILE%\.carry-intel\wallet.json   (Windows)
# fund it with USDC (Solana) — $0.10 funds five digest calls, or $0.02 buys one
```

This is a real on-chain payment wallet. Keep it dedicated and low-balance, never paste its key into chat, and do not replenish without an explicit decision. The CLI validates the 402 challenge's origin, exact route price, USDC mint, Solana mainnet, recipient, resource URL, and timeout before signing; mismatches abort.

Or set a different local wallet file: `CARRY_WALLET=/path/to/wallet.json`.

## Same product, other surfaces

- **Remote MCP:** `{"mcpServers":{"carry-intel":{"url":"https://devbox.tail873466.ts.net:10000/mcp"}}}` — listed in the official MCP registry as `io.github.TheArkofTech/carry-intel`
- **Raw HTTP/x402:** `https://devbox.tail873466.ts.net:10000` (see `/llms.txt`)
- **Track record:** https://github.com/TheArkOfTech/hl-carry-public — daily digests and settled prints. Exact current position sizes and balances are redacted by default.

## Why pay for data that comes from a public API?

Annualization uses the current hourly funding rate × 24 × 365 and is gross, not realized or forecast. The scan requires a USDC spot pair and at least $10,000 in 24-hour pair volume. This is only a spot-liquidity screen: order-book depth, fees, slippage, basis, and execution are not checked. The legacy `hedgeable` field and `UNHEDGEABLE` label indicate only whether that screen passed; they do not guarantee or rule out executable hedges. Exact position sizes and balances are redacted by default.

## License

Purchased data is licensed for the buyer's own use — no resale, no re-serving. Responses carry a server-generated HMAC watermark linked to settlement; its verification secret is not public, so buyers cannot independently validate it. See `license` command or https://devbox.tail873466.ts.net:10000/license.
