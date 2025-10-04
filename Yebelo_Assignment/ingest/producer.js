import fs from "fs";
import csv from "csv-parser";
import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

// Kafka configuration
const kafka = new Kafka({
  clientId: "csv-ingestion-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"]
});

const producer = kafka.producer();
const topic = process.env.KAFKA_TOPIC || "trade-data";

async function produceMessages() {
  await producer.connect();

  console.log(`🚀 Ingesting trades_data.csv into Redpanda topic: ${topic}`);

  fs.createReadStream("trades_data.csv")
    .pipe(csv())
    .on("data", async (row) => {
      try {
        // Convert each CSV row into JSON message
        const message = {
          token_address: row.token_address,
          price: parseFloat(row.price),
          timestamp: row.timestamp
        };

        await producer.send({
          topic,
          messages: [{ value: JSON.stringify(message) }]
        });

        console.log(`✅ Sent: ${JSON.stringify(message)}`);
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    })
    .on("end", async () => {
      console.log("🎉 CSV ingestion completed!");
      await producer.disconnect();
      process.exit(0);
    });
}

produceMessages().catch((err) => {
  console.error("Fatal ingestion error:", err);
  process.exit(1);
});
