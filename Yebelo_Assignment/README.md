#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting YEBELO Trading Dashboard Setup..."

# 1. Check Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Please install Docker."
  exit 1
fi

if ! command -v docker-compose &> /dev/null; then
  echo "❌ Docker Compose not found. Please install Docker Compose."
  exit 1
fi

echo "✅ Docker and Docker Compose found."

# 2. Start Docker containers
echo "📦 Starting Redpanda and Console..."
docker-compose up -d

# Wait a few seconds for services to be ready
sleep 5

# 3. Create Kafka topics
echo "📌 Creating Redpanda topics..."
docker exec -it redpanda rpk topic create trade-data || echo "Topic 'trade-data' exists"
docker exec -it redpanda rpk topic create rsi-data || echo "Topic 'rsi-data' exists"

# 4. Install Node dependencies
echo "📥 Installing frontend dependencies..."
cd frontend || exit
npm install
cd ..

# 5. Install Rust dependencies (if not already)
echo "🦀 Installing Rust dependencies..."
cd backend || exit
cargo build
cd ..

# 6. Done
echo "✅ Setup complete!"
echo "Frontend: http://localhost:3000"
echo "Redpanda Console: http://localhost:8080"
echo "WebSocket server (we-forwarder): ws://localhost:4000"
