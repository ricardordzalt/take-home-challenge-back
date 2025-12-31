#!/bin/bash

set -e

echo "🚀 Starting dockerization process..."

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: docker-compose or docker compose is not installed."
    exit 1
fi

COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null; then
    COMPOSE_CMD="docker-compose"
fi

echo "📦 Building and starting containers..."
$COMPOSE_CMD up --build -d

echo "✅ Containers are running!"
echo "📡 Application available at http://localhost:3000"
echo "📝 Check logs with: $COMPOSE_CMD logs -f app"

sleep 5

$COMPOSE_CMD ps
