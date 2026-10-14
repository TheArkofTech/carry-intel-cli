# carry-intel CLI — Hyperliquid funding-carry intelligence, per call via x402

Retrieve read-only Hyperliquid funding-screen data and settle paid routes with on-chain micropayments. No API key. No account. No signup.
Paid calls settle USDC on Solana mainnet through the x402 facilitator; the free digest and wallet-balance commands do not charge.

```
npx github:TheArkofTech/carry-intel-cli <command>
```

## Commands

| Command | Price | What you get |
|---|---|---|
| `free` | **$0.00** | Previous published digest; response names the sample and latest-report dates |
| `digest` | $0.02 | Latest daily settled-prints funding digest (markdown) |
| `verdicts` | $0.10 | Current EDGE/BASELINE/NEG funding classifications per tracked leg + basis gates; not proof of a position |
| `opportunities` | $0.50 | Funding candidates ranked by spot-liquidity screen; depth/fees/slippage/basis/execution unchecked |
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
- **Read-only MCP Console App:** optional UI endpoint at `https://devbox.tail873466.ts.net:10000/mcp/carry-console`, separate from the standard server and not included in `mcp-config`. Configure MCP Apps-capable clients:
  ```json
  {"mcpServers":{"carry-console":{"url":"https://devbox.tail873466.ts.net:10000/mcp/carry-console"}}}
  ```
  `carry_opportunities_ui` renders the same $0.50 scan. The current tool schema accepts only `ui_refresh`; payment authorization uses the HTTP `PAYMENT-SIGNATURE` header, never tool arguments. The app does not sign payments or execute trades.
- **Raw HTTP/x402:** `https://devbox.tail873466.ts.net:10000` (see `/llms.txt`)
- **Track record:** https://github.com/TheArkofTech/hl-carry-public — daily settled prints and evidence boundaries. The latest [`/verify`](https://devbox.tail873466.ts.net:10000/verify) observation at `2026-10-14T02:53:24.440Z` asserted a live position while returning an empty `perp_positions` list; do not infer open positions or strategy returns from this CLI.

## Why pay for data that comes from a public API?

Annualization uses the current hourly funding rate × 24 × 365 and is gross, not realized or forecast. The scan requires a USDC spot pair and at least $10,000 in 24-hour pair volume. This is only a spot-liquidity screen: order-book depth, fees, slippage, basis, and execution are not checked. The legacy `hedgeable` field and `UNHEDGEABLE` label indicate only whether that screen passed; they do not guarantee or rule out executable hedges. The CLI returns market-data screens, not a portfolio statement or evidence of open positions.

## License

Purchased data is licensed for the buyer's own use — no resale, no re-serving. Responses carry a server-generated HMAC watermark linked to settlement; its verification secret is not public, so buyers cannot independently validate it. See `license` command or https://devbox.tail873466.ts.net:10000/license.
