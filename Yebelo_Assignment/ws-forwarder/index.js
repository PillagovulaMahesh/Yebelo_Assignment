require('dotenv').config();
const { Kafka } = require('kafkajs');
const WebSocket = require('ws');

// Kafka/Redpanda setup
const kafka = new Kafka({
  clientId: 'we-forwarder',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'forwarder-group' });

// WebSocket server setup
const wss = new WebSocket.Server({ port: process.env.WS_PORT || 4000 });

wss.on('connection', (ws) => {
  console.log('Frontend connected via WebSocket');
});

// Forward Kafka messages to WebSocket clients
async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'rsi-data', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = message.value.toString();
      console.log(`Forwarding message: ${data}`);

      // Send to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    },
  });
}

run().catch(console.error);

console.log(`WebSocket server running on ws://localhost:${process.env.WS_PORT || 4000}`);
