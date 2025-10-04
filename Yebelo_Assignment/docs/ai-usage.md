# 🤖 AI Usage Log

This document explains how AI tools were used during the Yebelo Technologies Assignment.

---

## Tools Used
- **ChatGPT (OpenAI)**
- **Google Search**
- **GitHub Copilot (VSCode extension)**

---

## How AI Helped

### Phase 1: Infrastructure Setup (Docker + Redpanda)
- Used ChatGPT to generate a valid `docker-compose.yml` with **Redpanda Broker** and **Redpanda Console**.
- Asked AI to provide commands (`rpk topic create`) for topic creation.

### Phase 2: Data Ingestion (CSV to Redpanda)
- Used ChatGPT to scaffold a **Node.js producer** with `kafkajs` + `csv-parser`.
- Asked AI to explain how to handle backpressure when streaming CSV rows.

### Phase 3: Backend Processing with Rust
- Used ChatGPT to write skeleton code for a **Rust Kafka consumer** using `rdkafka` and `tokio`.
- Asked AI to explain RSI calculation (simple 14-period average vs Wilder’s smoothing).
- Used Copilot to autocomplete smaller Rust functions and JSON parsing.

### Phase 4: Frontend Dashboard (Next.js + Recharts)
- Used ChatGPT to scaffold a **Next.js + TypeScript app** with `TokenSelector`, `PriceChart`, and `RsiChart`.
- Asked AI to generate WebSocket integration code for live updates.
- Used Copilot to autocomplete TypeScript props and state types.

---

## Reflection
- AI tools were used for **boilerplate, configs, and explanations**.
- I carefully reviewed all AI-generated code to ensure I understood it.
- Documented assumptions (e.g., simple RSI calculation instead of Wilder smoothing).
