# 🏗️ System Architecture

This document describes the architecture of the Yebelo Technologies Assignment project.

---

## Overview

We are building a **real-time trading analytics system** with the following pipeline:

1. **Data Ingestion**  
   - A Node.js script reads `trades_data.csv`.  
   - Each row is parsed and published as a JSON message to **Redpanda** (`trade-data` topic).

2. **Backend Processing (Rust)**  
   - A Rust microservice consumes messages from `trade-data`.  
   - It groups trades by `token_address` and maintains a sliding window of the last 14 prices.  
   - It calculates the **Relative Strength Index (RSI)** per token.  
   - Results are published to **Redpanda** (`rsi-data` topic).

3. **Data Delivery (WS Forwarder)**  
   - Since browsers cannot directly connect to Kafka/Redpanda, a small Node.js **WebSocket server** consumes `trade-data` and `rsi-data`.  
   - It forwards messages to the frontend over WebSocket.

4. **Frontend Dashboard (Next.js + TypeScript)**  
   - Hosted on **Vercel** for deployment.  
   - Components:  
     - `TokenSelector` → Choose token from dropdown.  
     - `PriceChart` → Line chart of token price over time.  
     - `RsiChart` → Line chart of RSI with thresholds (30, 70).  
     - Numeric display for current price and RSI.  
   - Subscribes to WebSocket to receive live updates.



---

## Technologies

| Component        | Technology |
|------------------|------------|
| Containerization | Docker     |
| Broker           | Redpanda   |
| Ingestion        | Node.js    |
| Backend          | Rust       |
| Charts           | Recharts   |
| Frontend         | Next.js TS |
| Hosting          | Vercel     |

---

## Key Assumptions
- RSI is calculated using a **simple sliding-window average** over 14 prices (not Wilder’s smoothing).  
- WebSocket forwarder is used because browsers cannot natively connect to Kafka.  
- The system currently replays **historical data** (`trades_data.csv`) instead of true live data.  
