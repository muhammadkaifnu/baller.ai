#!/bin/bash

echo "🔄 Triggering data scrape..."
curl -X GET http://localhost:8000/trigger-scrape

echo ""
echo "✅ Scrape triggered! Check the AI Engine logs for progress."
echo ""
echo "📊 Fetching matches from server..."
sleep 2
curl -X GET http://localhost:5001/api/matches \
  -H "Authorization: Bearer test_token" \
  -H "Content-Type: application/json"
