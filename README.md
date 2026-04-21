# Server Monitor

Professional server monitoring tool with lightweight agents for real-time metrics collection and visualization.

## Features

- 🖥️ **Multi-server monitoring** - Monitor multiple servers from a single dashboard
- 📊 **Real-time metrics** - CPU, RAM, Disk, Network usage with live charts
- 🚨 **Alert system** - Configurable alerts with email/webhook notifications
- 🤖 **Lightweight agents** - Minimal resource footprint on monitored servers
- 🎨 **Modern UI** - Clean, professional dashboard built with Next.js + TailwindCSS
- 🔒 **Secure** - JWT authentication, encrypted agent communications

## Architecture

```
┌─────────────┐
│  Dashboard  │  (Next.js + React)
└──────┬──────┘
       │ WebSocket + REST
┌──────▼──────┐
│  API Server │  (Node.js + Express)
└──────┬──────┘
       │
┌──────▼──────┬───────────────┬──────────┐
│ PostgreSQL  │  InfluxDB     │  Redis   │
└─────────────┴───────────────┴──────────┘
       ▲
       │ HTTPS
┌──────┴──────┐
│   Agents    │  (Deployed on monitored servers)
└─────────────┘
```

## Quick Start

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- Yarn (recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/server-monitor.git
cd server-monitor
```

2. Install dependencies:
```bash
yarn install
```

3. Start databases:
```bash
yarn docker:up
```

4. Start development servers:
```bash
yarn dev
```

5. Access the dashboard:
- Frontend: http://localhost:3000
- API: http://localhost:4000

### Deploy an Agent

On the server you want to monitor:

```bash
# Download and install agent
curl -sSL https://your-domain.com/install.sh | bash -s -- --token YOUR_TOKEN

# Or manually
cd apps/agent
npm install
npm run build
npm start
```

## Project Structure

```
server-monitor/
├── apps/
│   ├── web/          # Next.js dashboard
│   ├── api/          # Express API server
│   └── agent/        # Monitoring agent
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utilities
├── docker-compose.yml
└── README.md
```

## Configuration

### Environment Variables

**API Server** (`apps/api/.env`):
```env
DATABASE_URL=postgresql://monitor:monitor123@localhost:5432/servermonitor
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=my-super-secret-auth-token
INFLUXDB_ORG=servermonitor
INFLUXDB_BUCKET=metrics
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PORT=4000
```

**Dashboard** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Agent** (`apps/agent/.env`):
```env
API_URL=https://your-api-server.com
AGENT_TOKEN=your-agent-token
COLLECTION_INTERVAL=10000
```

## Development

```bash
# Install dependencies
yarn install

# Start all services in development mode
yarn dev

# Build for production
yarn build

# Lint code
yarn lint

# Clean build artifacts
yarn clean
```

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, Recharts
- **Backend**: Node.js, Express, TypeScript, Socket.io
- **Agent**: Node.js, TypeScript, systeminformation
- **Databases**: PostgreSQL, InfluxDB, Redis
- **Infrastructure**: Docker, Docker Compose

## Features Roadmap

- [x] Basic metric collection (CPU, RAM, Disk, Network)
- [x] Multi-server dashboard
- [x] Real-time updates via WebSocket
- [ ] Alert rules engine
- [ ] Email/Slack notifications
- [ ] Process monitoring
- [ ] Service status tracking
- [ ] Custom metrics
- [ ] User management & roles
- [ ] Mobile app

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open a GitHub issue.
