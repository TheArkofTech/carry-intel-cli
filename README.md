# carry-intel CLI — Hyperliquid funding-carry intelligence, per call via x402

Buy live carry intelligence with on-chain micropayments. No API key. No account. No signup.
Every call settles USDC on Solana mainnet through the x402 facilitator.

```
npx github:TheArkofTech/carry-intel-cli <command>
```

## Commands

| Command | Price | What you get |
|---|---|---|
| `free` | **$0.00** | Yesterday's full funding digest — verify quality before paying |
| `digest` | $0.01 | Latest daily settled-prints funding digest (markdown) |
| `verdicts` | $0.05 | Live EDGE/BASELINE/NEG verdicts per tracked leg + basis gates + position tracking |
| `opportunities` | $0.25 | Full-universe scan: every positive-funding perp ranked by spot-hedgeability |
| `balance` | free | Your buyer wallet's USDC balance |
| `mcp-config` | free | JSON config to add this server to any MCP client |
| `license` | free | Proprietary Data License (no-resale, cryptographic provenance) |

## Wallet setup

```bash
mkdir -p ~/.carry-intel
# write a JSON array of 32 or 64 bytes (your Solana keypair) to:
#   ~/.carry-intel/wallet.json        (Linux/macOS)
#   %USERPROFILE%\.carry-intel\wallet.json   (Windows)
# fund it with USDC (Solana) — $0.05 covers the cheapest 5 paid calls
```

Or point elsewhere: `CARRY_WALLET=/path/to/wallet.json`.

## Same product, other surfaces

- **Remote MCP:** `{"mcpServers":{"carry-intel":{"url":"https://devbox.tail873466.ts.net:10000/mcp"}}}` — listed in the official MCP registry as `io.github.TheArkofTech/carry-intel`
- **Raw HTTP/x402:** `https://devbox.tail873466.ts.net:10000` (see `/llms.txt`)
- **Track record:** https://github.com/TheArkofTech/hl-carry-public — daily digests, settled hourly prints, proof-of-reserves. The operator trades this data live on Hyperliquid (public account).

## Why pay for data that comes from a public API?

Classification. 152/178 Hyperliquid perps sit at the default +10.95%/yr funding floor — that's commodity carry, not alpha. This product labels it BASELINE and reserves EDGE for genuine above-floor prints, checks every candidate for a *real* hedgeable spot pair (≥$10k/day volume), and flags dead-book traps as UNHEDGEABLE. The paid product is the *filter*, the *verdicts*, and the *live position tracking* — plus a cryptographic purchase receipt on every response.

## License

Purchased data is licensed for the buyer's own use — no resale, no re-serving. Every response carries an HMAC provenance receipt bound to the settlement transaction. See `license` command or https://devbox.tail873466.ts.net:10000/license.
