# Carry-Intel Proprietary Data License 1.0

**Effective: 2026-10-12 · Licensor: TheArkofTech · Product: carry-intel API & MCP (all endpoints under https://devbox.tail873466.ts.net:10000)**

## 1. Grant
Each settled x402 payment grants the buyer a **non-exclusive, non-transferable, revocable** license to the data in that response, for the buyer's own use only.

## 2. Permitted
- Reading, storing, and acting on purchased data for your own trading, research, or decision-making.
- Re-deriving analytics from purchased data for accounts you own or manage.

## 3. Prohibited
- **Redistribution or resale** of any purchased response, in whole or in substantial part.
- Serving purchased data through another API, MCP server, bot, or data product.
- Training or fine-tuning models on purchased data for redistribution.
- Systematic scraping of free routes (`/carry/digest/free`, `/llms.txt`, `/mcp` tools/list, `/carry/digest/latest` via any settlement) to reconstruct a competing product.

## 4. Provenance & enforcement
Every paid response carries an HMAC receipt (`x-carry-provenance` header / `_x402_provenance` field) bound to the on-chain settlement transaction hash. Redistributed output retains this watermark: any competing product built on purchased data is **attributable and provable from its own output**. Settlements are public on Solana mainnet to `22PpHwVGiikZMJKPLjMmbaUhfkoLG6J28NjJurbsM2g1`.

## 5. Facts are not licensable
Raw funding rates, prices, and exchange-sourced facts originate from Hyperliquid's public API and remain freely re-derivable by anyone. What this license protects is the **compiled work**: verdict taxonomy, hedgeability classification, digests, and the track record as organized expression. Nothing here restricts independent derivation from the primary source.

## 6. No warranty
Data is provided as-is. Funding rates change hourly; verdicts are point-in-time. No financial advice. To the maximum extent permitted by law, licensor is not liable for trading losses.

## 7. Termination
Violation of §3 terminates the license immediately; continued use of watermarked data after termination is infringement of the compiled work.
