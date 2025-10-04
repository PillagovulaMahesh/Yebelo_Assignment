"use client";

import { useState } from "react";
import TokenSelector from "../components/TokenSelector";
import PriceChart from "../components/PriceChart";
import RsiChart from "../components/RsiChart";

export default function HomePage() {
  // Tokens list (replace with real token addresses if available)
  const tokens = ["TokenA", "TokenB", "TokenC", "TokenD", "TokenE"];
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  // Mock price data
  const priceData = [
    { block_time: "2025-10-01T10:00:00Z", price_in_sol: 1.2 },
    { block_time: "2025-10-01T10:01:00Z", price_in_sol: 1.25 },
    { block_time: "2025-10-01T10:02:00Z", price_in_sol: 1.18 },
    { block_time: "2025-10-01T10:03:00Z", price_in_sol: 1.3 },
    { block_time: "2025-10-01T10:04:00Z", price_in_sol: 1.28 },
  ];

  // Mock RSI data
  const rsiData = [
    { block_time: "2025-10-01T10:00:00Z", rsi: 45 },
    { block_time: "2025-10-01T10:01:00Z", rsi: 55 },
    { block_time: "2025-10-01T10:02:00Z", rsi: 35 },
    { block_time: "2025-10-01T10:03:00Z", rsi: 72 },
    { block_time: "2025-10-01T10:04:00Z", rsi: 65 },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Real-Time Trading Dashboard
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Token Selector */}
        <TokenSelector
          tokens={tokens}
          selected={selectedToken}
          onChange={(t) => setSelectedToken(t)}
        />

        {/* Charts */}
        <PriceChart data={priceData} token={selectedToken} />
        <RsiChart data={rsiData} token={selectedToken} />
      </div>
    </main>
  );
}
