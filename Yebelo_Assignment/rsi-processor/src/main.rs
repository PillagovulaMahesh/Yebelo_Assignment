use std::time::Duration;
use std::collections::VecDeque;
use futures::StreamExt;
use rdkafka::config::ClientConfig;
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::producer::{FutureProducer, FutureRecord};
use rdkafka::message::BorrowedMessage;
use serde::{Deserialize, Serialize};
use serde_json::json;
use log::{info, error};

/// Trade message from ingest service
#[derive(Debug, Deserialize)]
struct Trade {
    token_address: String,
    price_in_sol: f64,
    block_time: String,
}

/// RSI output message
#[derive(Debug, Serialize)]
struct RsiData {
    token_address: String,
    rsi: f64,
    block_time: String,
}

/// Calculate RSI from recent prices
fn calculate_rsi(prices: &VecDeque<f64>, period: usize) -> Option<f64> {
    if prices.len() < period + 1 {
        return None;
    }

    let mut gains = 0.0;
    let mut losses = 0.0;

    for i in 1..=period {
        let change = prices[i] - prices[i - 1];
        if change > 0.0 {
            gains += change;
        } else {
            losses -= change;
        }
    }

    if losses == 0.0 {
        return Some(100.0);
    }

    let rs = gains / losses;
    let rsi = 100.0 - (100.0 / (1.0 + rs));

    Some(rsi)
}

/// Handle an incoming trade message
async fn handle_trade_message(
    msg: &BorrowedMessage<'_>,
    producer: &FutureProducer,
    price_cache: &mut std::collections::HashMap<String, VecDeque<f64>>,
    period: usize,
) {
    if let Some(payload) = msg.payload_view::<str>().ok().flatten() {
        match serde_json::from_str::<Trade>(payload) {
            Ok(trade) => {
                let entry = price_cache
                    .entry(trade.token_address.clone())
                    .or_insert_with(|| VecDeque::with_capacity(period + 1));

                if entry.len() == period + 1 {
                    entry.pop_front();
                }
                entry.push_back(trade.price_in_sol);

                if let Some(rsi) = calculate_rsi(entry, period) {
                    let rsi_data = RsiData {
                        token_address: trade.token_address,
                        rsi,
                        block_time: trade.block_time,
                    };

                    let payload = serde_json::to_string(&rsi_data).unwrap();
                    let record = FutureRecord::to("rsi-data")
                        .payload(&payload)
                        .key("rsi");

                    if let Err(e) = producer.send(record, Duration::from_secs(0)).await {
                        error!("Failed to send RSI data: {:?}", e);
                    } else {
                        info!("Published RSI data: {}", payload);
                    }
                }
            }
            Err(e) => error!("Failed to parse trade JSON: {:?}", e),
        }
    }
}

#[tokio::main]
async fn main() {
    env_logger::init();

    let brokers = "localhost:9092";
    let group_id = "rsi-processor-group";

    // Consumer setup
    let consumer: StreamConsumer = ClientConfig::new()
        .set("bootstrap.servers", brokers)
        .set("group.id", group_id)
        .set("enable.partition.eof", "false")
        .set("session.timeout.ms", "6000")
        .set("enable.auto.commit", "true")
        .create()
        .expect("Consumer creation failed");

    consumer
        .subscribe(&["trade-data"])
        .expect("Can't subscribe to topic");

    // Producer setup
    let producer: FutureProducer = ClientConfig::new()
        .set("bootstrap.servers", brokers)
        .create()
        .expect("Producer creation failed");

    let mut stream = consumer.stream();
    let mut price_cache: std::collections::HashMap<String, VecDeque<f64>> = std::collections::HashMap::new();
    let period = 14;

    info!("RSI processor started...");

    while let Some(message) = stream.next().await {
        match message {
            Ok(m) => handle_trade_message(&m, &producer, &mut price_cache, period).await,
            Err(e) => error!("Kafka error: {}", e),
        }
    }
}
