# Server Monitor - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd server-monitor
npm install
```

### 2. Start Databases

```bash
npm run docker:up
```

This starts:
- PostgreSQL on port 5432
- InfluxDB on port 8086
- Redis on port 6379

### 3. Configure Environment

**API Server** (`apps/api/.env`):
```bash
cp apps/api/.env.example apps/api/.env
# Edit if needed - defaults should work
```

**Dashboard** (`apps/web/.env.local`):
```bash
cp apps/web/.env.local.example apps/web/.env.local
# Edit if needed - defaults should work
```

### 4. Start Development

```bash
npm run dev
```

This starts:
- Dashboard: http://localhost:3000
- API Server: http://localhost:4000

### 5. Add Your First Server

1. Open http://localhost:3000
2. Click "Add Server"
3. Enter hostname and IP
4. Copy the agent installation token

### 6. Deploy Agent

On the server you want to monitor:

```bash
# Create agent directory
mkdir -p ~/server-monitor-agent
cd ~/server-monitor-agent

# Copy agent code from apps/agent/
# Or clone and navigate to apps/agent

# Install dependencies
npm install

# Configure
cp .env.example .env
# Edit .env with your SERVER_ID and AGENT_TOKEN from step 5

# Start agent
npm run build
npm start
```

For production, use PM2 or systemd to keep the agent running:

```bash
# With PM2
npm install -g pm2
pm2 start dist/index.js --name server-monitor-agent
pm2 save
pm2 startup
```

## Production Deployment

### Backend (API)

```bash
cd apps/api
npm run build
npm start
```

Use a process manager like PM2:
```bash
pm2 start dist/index.js --name server-monitor-api
```

### Frontend (Dashboard)

```bash
cd apps/web
npm run build
npm start
```

Or deploy to Vercel/Netlify for static hosting.

### Databases

For production, use managed services:
- PostgreSQL: AWS RDS, Digital Ocean, etc.
- InfluxDB Cloud
- Redis: Upstash, Redis Cloud

Update `.env` files with production credentials.

## Architecture

```
apps/
├── web/      - Next.js dashboard (port 3000)
├── api/      - Express API server (port 4000)
└── agent/    - Monitoring agent (deployed on target servers)

packages/
├── types/    - Shared TypeScript types
└── utils/    - Shared utilities
```

## Features

- ✅ Real-time metrics (CPU, RAM, Disk, Network)
- ✅ Multi-server dashboard
- ✅ WebSocket live updates
- ✅ Server registration & management
- 🚧 Alert rules engine (coming soon)
- 🚧 Email/Slack notifications (coming soon)
- 🚧 Process monitoring (coming soon)

## Troubleshooting

### Database Connection Issues

```bash
# Check if databases are running
docker ps

# View logs
docker logs server-monitor-postgres
docker logs server-monitor-influxdb
docker logs server-monitor-redis

# Restart databases
npm run docker:down
npm run docker:up
```

### Agent Not Connecting

1. Check API server is running and accessible
2. Verify AGENT_TOKEN and SERVER_ID in agent `.env`
3. Check firewall rules if agent is on different server
4. View agent logs for error messages

### Port Already in Use

If ports 3000 or 4000 are in use:

```bash
# Change API port in apps/api/.env
PORT=4001

# Change web port
cd apps/web
npm run dev -- -p 3001

# Update NEXT_PUBLIC_API_URL in apps/web/.env.local
```

## Support

- GitHub Issues: <repo-issues-url>
- Documentation: README.md
- Architecture: ARCHITECTURE.md
