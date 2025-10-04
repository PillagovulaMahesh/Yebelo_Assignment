"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface RsiChartProps {
  data: { block_time: string; rsi: number }[];
  token: string;
}

export default function RsiChart({ data, token }: RsiChartProps) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">RSI Chart ({token})</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="block_time" hide />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <ReferenceLine y={30} stroke="red" strokeDasharray="3 3" />
          <ReferenceLine y={70} stroke="green" strokeDasharray="3 3" />
          <Line type="monotone" dataKey="rsi" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
