#!/bin/bash
# Server Monitor - Easypanel Deployment Script
# Run this with: sudo bash deploy-easypanel.sh

set -e

echo "🚀 Deploying Server Monitor to Easypanel..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run with sudo${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Pulling latest code...${NC}"
cd /home/node/.openclaw/workspace/server-monitor
git pull origin main

echo ""
echo -e "${BLUE}📦 Step 2: Building and starting services with Docker Compose...${NC}"
docker compose -f docker-compose.production.yml down 2>/dev/null || true
docker compose -f docker-compose.production.yml up -d --build

echo ""
echo -e "${BLUE}⏳ Step 3: Waiting for services to be healthy (30s)...${NC}"
sleep 30

echo ""
echo -e "${BLUE}🔍 Step 4: Checking service status...${NC}"
docker compose -f docker-compose.production.yml ps

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📍 Services running on:"
echo "   - Dashboard: http://localhost:3000"
echo "   - API: http://localhost:4000"
echo "   - PostgreSQL: localhost:5432"
echo "   - InfluxDB: localhost:8086"
echo "   - Redis: localhost:6379"
echo ""
echo "🌐 Next steps in Easypanel Dashboard:"
echo "   1. Go to your Easypanel panel"
echo "   2. Add domains for:"
echo "      - Port 3000 → monitor.itsyeasin.com"
echo "      - Port 4000 → monitor-api.itsyeasin.com"
echo "   3. Enable SSL (automatic)"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker compose -f docker-compose.production.yml logs -f"
echo "   Restart:      docker compose -f docker-compose.production.yml restart"
echo "   Stop:         docker compose -f docker-compose.production.yml down"
echo "   Rebuild:      sudo bash deploy-easypanel.sh"
echo ""
