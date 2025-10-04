import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "ws";
import { Kafka } from "kafkajs";

let wss: Server | null = null;

// Disable Next.js default body parser for WebSockets
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) {
    res.status(500).end();
    return;
  }

  // If WebSocket server already exists, reuse it
  if (wss) {
    res.end();
    return;
  }

  const server = res.socket.server as any;

  // Create WebSocket server
  wss = new Server({ server });
  console.log("✅ WebSocket server started at /api/ws");

  // Kafka client setup
  const kafka = new Kafka({
    clientId: "frontend-consumer",
    brokers: ["localhost:9092"], // update if different in docker-compose
  });

  const consumer = kafka.consumer({ groupId: "frontend-group" });

  (async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "rsi-data", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const data = message.value.toString();

        // Broadcast RSI data to all connected WS clients
        wss?.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(data);
          }
        });
      },
    });
  })().catch((err) => console.error("Kafka error:", err));

  res.end();
}
